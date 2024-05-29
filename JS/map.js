/**
 * Script gestione mappa
*/

"use strict";

//! Variabili globali e flags
const centerCoordinates = [45.309062, 9.501200];
const map = L.map('map', { zoomControl: false }).setView(centerCoordinates, 14);
const menus = [                     // ID di ogni singolo menu esistente
    "addSingleMarkerMenu",
    "packagesMenu",
    "chiSiamoMenu",
    "accessibilityMenu",
    "settingsMenu",
    "accountMenu"
];

var availablePlace = [];            // Flag se il marker esiste già o no (prevenire spam)
var singleMarkers = {};             // Contiene i singoli markers creati
var __shouldNavbarExpand__ = true;  // La barra laterale dovrebbe espandersi al prossimo click?
var informations;                   // Contiene le informazioni presi dai JSON
var openedMenuId;                   // Contiene l'id del menu aperto in quel momento
var currentPackageRouting;          // Quale pacchetto è "piazzato"?


//! Fetch e inizializzazione informazioni
/* Prendi informazioni dai JSON... */
async function fetchInfos(languageToFetch) {
    // Resetta tutto...
    availablePlace = [];
    singleMarkers = {};
    currentPackageRouting = undefined;
    informations = undefined;

    // Prendi dal JSON giusto..
    if (localStorage.length != 0 && languageToFetch === undefined) {
        languageToFetch = localStorage.getItem('currentLanguageID');
    }

    switch (languageToFetch) {
        case 'it':
            var response = await fetch('../JSON/languageTranslations/italiano.json');
            informations = await response.json();
            availablePlaceLanguageRefill();     // Refilla 'availablePlace'

            break;

        case 'en':
            var response = await fetch('../JSON/languageTranslations/english.json');
            informations = await response.json();
            availablePlaceLanguageRefill();

            break;

        case 'es':
            var response = await fetch('../JSON/languageTranslations/espanol.json');
            informations = await response.json();
            availablePlaceLanguageRefill();

            break;

        case 'de':
            var response = await fetch('../JSON/languageTranslations/deutsch.json');
            informations = await response.json();
            availablePlaceLanguageRefill();

            break;

        case 'fr':
            var response = await fetch('../JSON/languageTranslations/francais.json');
            informations = await response.json();
            availablePlaceLanguageRefill();

            break;

        case 'pt-BR':
            var response = await fetch('../JSON/languageTranslations/portugues.json');
            informations = await response.json();
            availablePlaceLanguageRefill();

            break;

        default:
            var response = await fetch('../JSON/languageTranslations/italiano.json');
            informations = await response.json();
            availablePlaceLanguageRefill();

            break;
    }

    localStorage.setItem('currentLanguageID', (languageToFetch === undefined ? 'it' : languageToFetch));

    // Funzione per refillare 'availablePlace'
    function availablePlaceLanguageRefill() {
        Object.keys(informations.placesNames).forEach(place => {
            availablePlace.push(place);
        });
    }

    // Chiama per aggiornare i tooltip dei pulsanti
    setButtonTooltips();

    // Notifica di quale è stato fetchato
    console.log('Successfully fetched [', localStorage.getItem('currentLanguageID'), ']');
}
/* Mette tooltips ai pulsanti */
function setButtonTooltips() {
    // Prende dall'HTML per classe
    let buttons = document.getElementsByClassName('function-button');

    let titles = [
        informations.menuNames[0],  // Espandi / chiudi
        informations.menuNames[1],  // Account
        informations.menuNames[4],  // Itinerari
        informations.menuNames[10], // Accessibilità
        informations.menuNames[15], // Impostazioni
        informations.menuNames[21], // Il Nostro Team
        informations.menuNames[24], // Pagina principale
        informations.menuNames[1],  // Account x2
        informations.menuNames[25], // Centra mappa
        informations.menuNames[26]  // Marker singolo
    ];

    for (let i = 0; i < buttons.length; i++) {
        buttons[i].title = titles[i];
    }
}

/* Attendiamo di aver preso i dati prima di procedere all'avvio della pagina... */
async function startWebsite() {
    await fetchInfos();
}
startWebsite();


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
/* Avvia mappa a caricamento pagina */
document.body.onload = () => {
    initializeMap();
    map.on('click', () => {
        closeOpenMenus();
        __shouldNavbarExpand__ = false;
        toggleExpandedNavbar();
    });

    //TODO: Rimuovere questo quando non servirà più (cancellare "DEBUGGING")
    coordinatesOnClick();
};

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