/**
 * Script gestione mappa
*/

"use strict";

//! Variabili globali e flags
const centerCoordinates = [45.309062, 9.501200];
const map = L.map('map', { zoomControl: false }).setView(centerCoordinates, 14);
const menus = [                     // ID di ogni singolo menu esistente
    'account-menu',
    'packages-menu',
    'news-menu',
    'accessibility-menu',
    'settings-menu',
    'chi-siamo-menu',
    'single-marker-menu'
];

var availablePlace = [];            // Flag se il marker esiste già o no (prevenire spam)
var singleMarkers = {};             // Contiene i singoli markers creati
var __shouldNavbarExpand__ = true;  // La barra laterale dovrebbe espandersi al prossimo click?
var openedMenuId;                   // Contiene l'id del menu aperto in quel momento
var currentPackageRouting;          // Quale pacchetto è "piazzato"?


//! Funzioni mappa
/* Inizializza 'onLoad' */
function initializeMap() {
    const bounds = [
        [45.375506, 9.37052],
        [45.088259, 9.66326]
    ];

    // Funzioni necessarie (+ min e max zoom)
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        minZoom: 12,
        maxZoom: 19
    }).addTo(map);

    // Imposta limiti
    map.setMaxBounds(bounds);

    // Controlli zoom pulsanti
    L.control.zoom({
        position: 'topright'
    }).addTo(map);
}
/* Ri-centrare la mappa */
function recenterMap() {
    //                     coordinate                                  zoom            durata             lineare
    map.flyTo(new L.LatLng(centerCoordinates[0], centerCoordinates[1]), 14, { duration: 0.2, easeLinearity: 1 });
}
/* "Svuota" mappa */
function clearAllFromMap() {
    removeLaidPackage();
    singleMarkerMenuRemoveAll();
    console__removeMarkersAndRoute();
    closeOpenMenus();
    __shouldNavbarExpand__ = false;
    toggleExpandedNavbar();
}
/* Mette tooltips ai pulsanti */
function setButtonTooltips() {
    /* Per i pulsanti nella navbar */
    let functionButtons = document.getElementsByClassName('function-button');

    let functionButtonsTitles = [
        menuTranslations["navbar--tooltip"][languageID],  // Espandi / chiudi
        menuTranslations["account-menu--title"][languageID],  // Account
        menuTranslations["packages-menu--title"][languageID],  // Itinerari
        menuTranslations["news-menu--title"][languageID],  // Notizie
        menuTranslations["accessibility-menu--title"][languageID], // Accessibilità
        menuTranslations["settings-menu--title"][languageID], // Impostazioni
        menuTranslations["chi-siamo-menu--title"][languageID], // Il Nostro Team
        menuTranslations["home-page-link--tooltip"][languageID], // Pagina principale
        menuTranslations["account-menu--title"][languageID]   // Account x2
    ];

    for (let i = 0; i < functionButtons.length; i++) {
        functionButtons[i].title = functionButtonsTitles[i];
    }


    /* Per i pulsanti nella navbar */
    let actionButtons = document.getElementsByClassName('action-button');

    let actionButtonsTitles = [
        menuTranslations["recenter-map--action-button--tooltip"][languageID],
        menuTranslations["clear-all-from-map--action-button--tooltip"][languageID]
    ];

    for (let i = 0; i < actionButtons.length; i++) {
        actionButtons[i].title = actionButtonsTitles[i];
    }
}
// Funzione per refillare 'availablePlace'
function availablePlaceLanguageRefill() {
    Object.keys(placesTranslations).forEach(place => {
        availablePlace.push(place);
    });
}

//! Funzionalità menu
/* Chiudi tutti menu aperti */
function closeOpenMenus() {
    menus.forEach(menu => {
        document.getElementById(menu).classList.remove('menu--active');
    });
    openedMenuId = undefined;   // Svuota flag
}
/* Chiusura / apertura menu a click del rispettivo pulsante */
function handleMenuButtonPress(menu) {
    // Se attivo, allora chiudilo
    if (menu.classList.contains('menu--active')) {
        closeOpenMenus();
        return 'yes';   // Restituisce 'yes' (si, fai 'return') al menu che l'ha invocato (altrimenti lo apre comunque)
    }

    // Chiusura dei menu al click del pulsante di un altro menu (solo uno aperto alla volta)
    if (openedMenuId != undefined) {
        closeOpenMenus();
    }
}
function toggleExpandedNavbar() {
    let navbarContent = document.getElementById('navbar--content');

    if (__shouldNavbarExpand__) {
        navbarContent.style.height = navbarContent.scrollHeight + 'px';
        __shouldNavbarExpand__ = false;
    } else {
        navbarContent.style.height = '0px';
        __shouldNavbarExpand__ = true;
    }
}
/* Genera 'div' con 'img' in base al valore inserito sono 'piene' o no (necessaria per 'bindPopupInfos') */
function rate(fullStarsNumber) {
    let rating = '';
    for (let i = 0; i < fullStarsNumber; i++) {
        rating += '<img src="../img/popup-rating-stars/fullStar.png" class="popup--stars">';
    }
    for (let i = 0; i < (5 - fullStarsNumber); i++) {
        rating += '<img src="../img/popup-rating-stars/emptyStar.png" class="popup--stars">';
    }
    rating = '<div class="popup--rating">' + rating + '</div>';

    return rating;
}
/* Genera le 'info' necessarie da aggiungere a ciascun popup tramite '.bindPopup(info)' */
function bindPopupInfos(title, rating, description, imageLink) {
    if (title === undefined || title == '') { title = 'Titolo inesistente'; }
    if (imageLink === undefined || imageLink == '') { imageLink = '../img/tappe-popup/Torre-Zucchetti.jpg'; }
    if (description === undefined || description == '') { description = 'Descrizione di "' + title + '" inesistente'; }
    if (rating === undefined || rating < 0) { rating = 4; }

    imageLink = '<img src="' + imageLink + '" alt="' + title + '" style="color: white" class="popup--image">';
    title = '<p class="popup--title text-to-speak">' + title + '</p>';
    rating = rate(rating);
    description = '<p class="popup--description text-to-speak">' + description + '</p>';

    let info = title + rating + description + imageLink;
    return info;
}