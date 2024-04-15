/**
 * Script gestione mappa e menu... e tutto il resto (yes, file management)
*/

"use strict";

//! Coordinate per centrare la mappa
const centerCoordinates = [45.309062, 9.501200];
//! Costante che contiene LA MAPPA
const map = L.map('map', { zoomControl: false }).setView(centerCoordinates, 14);


//! Icona markers
function createMarkerIcon(url) {
    return L.icon({
        iconUrl: url,

        iconSize: [48, 48],     // Grandezza icona
        iconAnchor: [35, 60],     // Punto dell'icona che indicherà il punto preciso sulla mappa
        popupAnchor: [-10, -60]    // Punto da dove il popup si apre
    });
}


//! Costanti globali
const markerIcon = createMarkerIcon('../img/marker-icone/markerIcona.png');
const markerIconGold = createMarkerIcon('../img/marker-icone/markerIcona-gold.png');
const menus = [         // ID di ogni singolo menu esistente
    "addSingleMarkerMenu",
    "packagesMenu",
    "chiSiamoMenu",
    "accessibilityMenu",
    "settingsMenu",
    "accountMenu"
];
const languagesList = [ // Lista lingue supportate
    "🇮🇹 - Italiano",
    "🇬🇧 - English",
    "🇫🇷 - Français",
    "🇪🇸 - Español",
    "🇩🇪 - Deutsch",
    "🇵🇹 - Português"
];
const languagesListID = [
    'it',
    'en',
    'fr',
    'es',
    'de',
    'pt-BR'
];


//! Variabili globali e flags
var __shouldNavbarExpand__ = true;
var __isPackageLaid__ = false;          // C'è un pacchetto iniziato?
var __wasProgressMade__ = false;        // È stato confermato del progresso in un itinerario?
var informations;                       // Contiene le informazioni presi dai JSON
var openedMenuId;                       // Contiene l'id del menu aperto in quel momento
var availablePlace = [];                // Flag se il marker esiste già o no (prevenire spam)
var singleMarkers = {};                 // Contiene i singoli markers creati
var waypoints;                          // Contiene i waypoints per l'itinerario corrente
var currentPackageRouting;              // Quale pacchetto è "piazzato"?
var completedItinerarySegment;          // Contiene la parte di itinerario percorsa

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
    console.log(
        'Information fetched successfully for\n',
        (languageToFetch == undefined) ? 'it' : languageToFetch,
        localStorage
    );
}
/* Mette tooltips ai pulsanti */
function setButtonTooltips() {
    // Prende dall'HTML per classe
    let buttons = document.getElementsByClassName('isButton');

    let titles = [
        informations.menuNames[0],  // Espandi / chiudi
        informations.menuNames[1],  // Account
        informations.menuNames[2],  // Itinerari
        informations.menuNames[8],  // Accessibilità
        informations.menuNames[13], // Impostazioni
        informations.menuNames[19], // Il Nostro Team
        informations.menuNames[21], // Pagina principale
        informations.menuNames[22], // Centra mappa
        informations.menuNames[23]  // Marker singolo
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
        [45.155433, 9.62299]
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

//* Per debugging */
function coordinatesOnClick() {
    // Click e output coordinate in console
    map.on('click', (e) => {
        console.log('[' + e.latlng.lat.toFixed(6) + ', ' + e.latlng.lng.toFixed(6) + ']');
    });
}
function markerFromConsole([latitude, longitude]) {
    let coords = [latitude, longitude];
    let output = "[" + coords[0] + ", " + coords[1] + "]";
    L.marker(coords).addTo(map).bindPopup(output);
}

/* Avvia mappa a caricamento pagina */
document.body.onload = () => {
    console.log('Initializing map...');
    initializeMap();
    coordinatesOnClick();
    map.on('click', () => {
        closeOpenMenus();
        __shouldNavbarExpand__ = false;
        toggleExpandedNavbar();
    });
};

/* Genera 'div' con 'img' in base al valore inserito sono 'piene' o no (necessaria per 'bindPopupInfos') */
function rate(fullStarsNumber) {
    let rating = '';
    for (let i = 0; i < fullStarsNumber; i++) {
        rating += '<img src="../img/popup-rating-stars/fullStar.png" class="popupStars">';
    }
    for (let i = 0; i < (5 - fullStarsNumber); i++) {
        rating += '<img src="../img/popup-rating-stars/emptyStar.png" class="popupStars">';
    }
    rating = '<div class="popupRating">' + rating + '</div>';

    return rating;
}
/* Genera le 'info' necessarie da aggiungere a ciascun popup tramite '.bindPopup(info)' */
function bindPopupInfos(title, rating, description, imageLink) {
    if (title === undefined || title == '') { title = 'Titolo inesistente'; }
    if (imageLink === undefined || imageLink == '') { imageLink = '../img/tappe-popup/Torre-Zucchetti.jpg'; }
    if (description === undefined || description == '') { description = 'Descrizione di "' + title + '" inesistente'; }
    if (rating === undefined || rating < 0) { rating = 4; }

    imageLink = '<img src="' + imageLink + '" alt="' + title + '" style="color: white" class="popupImage">';
    title = '<p class="popupTitle textToSpeak">' + title + '</p>';
    rating = rate(rating);
    description = '<p class="popupDescription textToSpeak">' + description + '</p>';

    let info = title + rating + description + imageLink;
    return info;
}


//! Funzionalità menu
/* Chiudi tutti menu aperti */
function closeOpenMenus() {
    menus.forEach(menu => {
        document.getElementById(menu).classList.remove('activeMenu');
    });
    openedMenuId = undefined;   // Svuota flag
}
/* Chiusura / apertura menu a click del rispettivo pulsante */
function handleMenuButtonPress(menu) {
    // Se attivo, allora chiudilo
    if (menu.classList.contains('activeMenu')) {
        closeOpenMenus();
        return 'yes';   // Restituisce 'yes' (si, fai 'return') al menu che l'ha invocato (altrimenti lo apre comunque)
    }

    // Chiusura dei menu al click del pulsante di un altro menu (solo uno aperto alla volta)
    if (openedMenuId != undefined) {
        closeOpenMenus();
    }
}
function toggleExpandedNavbar() {
    let navbarContent = document.getElementById('navbarContent');

    if (__shouldNavbarExpand__) {
        navbarContent.style.height = navbarContent.scrollHeight + 'px';
        __shouldNavbarExpand__ = false;
    } else {
        navbarContent.style.height = '0px';
        __shouldNavbarExpand__ = true;
    }
}


//! Marker singoli
function addSingleMarkerMenu() {
    let id = 'addSingleMarkerMenu';


    /* Funzioni necessarie gestione menu */
    let menu = document.getElementById(id);
    let shouldThisMenuClose = handleMenuButtonPress(menu);
    if (shouldThisMenuClose == 'yes') { return; }


    /* Titolo */
    menu.querySelector('span').textContent = informations.menuNames[23];

    /* Opzioni per il select */
    let select = menu.querySelector('select');
    let selectedIndex = select.selectedIndex;   // Salva l'index, così rimane alla prossima apertura

    // Svuota il select...
    if (select.hasChildNodes()) {
        while (select.firstChild) {
            select.removeChild(select.firstChild);
        }
    }

    // ... e riempilo con i "nuovi" options
    let optionsNames = Object.values(informations.placesNames).map(array => array[1]);
    for (let i = 0; i < optionsNames.length; i++) {
        let option = document.createElement('option');
        option.value = Object.keys(informations.placesNames)[i];
        option.text = optionsNames[i];
        select.appendChild(option);
    }
    // Ripristina l'index per l'apertura
    if (selectedIndex >= 0 && selectedIndex < select.options.length) {
        select.selectedIndex = selectedIndex;
    }

    /* Pulsanti */
    let buttons = menu.querySelectorAll('div button');

    // Testo e funzione per ciascuno
    buttons[0].textContent = informations.menuNames[24];
    buttons[0].setAttribute('onclick', 'singleMarkerMenuPlace()');

    buttons[1].textContent = informations.menuNames[25];
    buttons[1].setAttribute('onclick', 'singleMarkerMenuRemove()');

    buttons[2].textContent = informations.menuNames[26];
    buttons[2].setAttribute('onclick', 'singleMarkerMenuAddAll()');

    buttons[3].textContent = informations.menuNames[27];
    buttons[3].setAttribute('onclick', 'singleMarkerMenuRemoveAll()');

    /* Attiva il menu */
    menu.classList.toggle('activeMenu');

    /* Update flag */
    openedMenuId = id;
}

//* Funzioni */
/* Genera un singolo marker */
function newSingleMarker([latitude, longitude], info) {
    if ([latitude, longitude] == undefined) {
        console.log('Could not place marker, coordinates undefined!');
        return null;
    }

    // Crea marker...
    let marker = L.marker([latitude, longitude], { icon: markerIcon }).addTo(map).bindPopup(info);

    // ... e in output per salvarlo in 'markers' nella funzione 'addSingleMarkerMenu'...
    return marker;
}
/* Metti / togli marker singolo piazzato */
function singleMarkerMenuPlace() {
    var selectedPlace = document.querySelector('#addSingleMarkerMenu select').value;

    // Crea il nuovo marker se non già piazzato e lo salva dentro 'markers'
    if (availablePlace.includes(selectedPlace)) {
        // Genera le informazioni da aggiungere al popup con le informazioni da 'informations'
        var bindingInfos = bindPopupInfos(
            informations.placesNames[selectedPlace][1],
            informations.placesNames[selectedPlace][2],
            informations.placesNames[selectedPlace][3],
            informations.placesNames[selectedPlace][4]
        );

        //TODO
        /* console.log();

        JSPBridge.call('betterwayss.Server', 'convert',
            informations.placesNames[selectedPlace][0][0] + ' , ' +
            informations.placesNames[selectedPlace][0][1] + ' , ' +
            informations.placesNames[selectedPlace][1]
        ); */

        // Piazza il menu e salvalo in 'singleMarkers'
        singleMarkers[selectedPlace] = newSingleMarker(informations.placesNames[selectedPlace][0], bindingInfos);
        // Svuota lo spazio da 'availablePlace'
        availablePlace[availablePlace.indexOf(selectedPlace)] = null;
    }
}
function singleMarkerMenuRemove() {
    var selectedPlace = document.querySelector('#addSingleMarkerMenu select').value;

    // Se il marker non è piazzato, lo toglie
    if (!(availablePlace.includes(selectedPlace))) {
        map.removeLayer(singleMarkers[selectedPlace]);

        // Il valore viene ripristinato, invece di 'null'
        availablePlace[availablePlace.indexOf(null)] = selectedPlace;
    }
}
/* Metti / togli TUTTI i marker piazzati */
function singleMarkerMenuAddAll() {
    // Se sono tutti piazzati, esci dalla funzione...
    if (availablePlace.every(element => element === null)) {
        return;
    }

    // ... altrimenti, lo piazza
    for (let i = 0; i < availablePlace.length; i++) {
        let marker = availablePlace[i];

        if (marker === null) {
            continue; // Skippa al prossimo se il corrente è 'null'
        }

        // Genera le informazioni da aggiungere al popup con le informazioni da 'informations'
        var bindingInfos = bindPopupInfos(
            informations.placesNames[marker][1],
            informations.placesNames[marker][2],
            informations.placesNames[marker][3],
            informations.placesNames[marker][4]
        );

        //TODO
        /* console.log();

        JSPBridge.call('betterwayss.Server', 'convert',
            informations.placesNames[marker][0][0] + ' , ' +
            informations.placesNames[marker][0][1] + ' , ' +
            informations.placesNames[marker][1]
        ); */

        // Piazza il menu e salvalo in 'singleMarkers'
        singleMarkers[marker] = newSingleMarker(informations.placesNames[marker][0], bindingInfos);
        // Svuota lo spazio da 'availablePlace'
        availablePlace[i] = null;
    }
}
function singleMarkerMenuRemoveAll() {
    // Per ogni 'marker' in 'singleMarkers', rimuovi dalla mappa con funzione Leaflet
    for (const marker in singleMarkers) {
        map.removeLayer(singleMarkers[marker]);
    }
    singleMarkers = {};
    // Svuota e riempi 'availablePlace' con i posti (resettati)
    availablePlace = [];
    Object.keys(informations.placesNames).forEach(place => {
        availablePlace.push(place);
    });
}


//! Account menu
function accountMenu() {
    let id = 'accountMenu';

    /* Funzioni necessarie gestione menu */
    let menu = document.getElementById(id);
    let shouldThisMenuClose = handleMenuButtonPress(menu);
    if (shouldThisMenuClose == 'yes') { return; }

    /* Titolo */
    menu.querySelector('div').textContent = informations.menuNames[1];

    /* Attiva il menu */
    menu.classList.toggle('activeMenu');

    /* Update flag */
    openedMenuId = id;
}


//! Pacchetti
function packagesMenu() {
    let id = 'packagesMenu';

    /* Funzioni necessarie gestione menu */
    let menu = document.getElementById(id);
    let shouldThisMenuClose = handleMenuButtonPress(menu);
    if (shouldThisMenuClose == 'yes') { return; }

    /* Titolo */
    menu.querySelector('span').textContent = informations.menuNames[2];

    /* Opzioni per il select */
    let select = menu.querySelector('select');
    let selectedIndex = select.selectedIndex;   // Salva l'index, così rimane alla prossima apertura

    // Svuota il select...
    if (select.hasChildNodes()) {
        while (select.firstChild) {
            select.removeChild(select.firstChild);
        }
    }

    // ... e riempilo con i "nuovi" options
    let optionsNames = Object.keys(informations.itineraryNames);
    for (let i = 0; i < optionsNames.length; i++) {
        let option = document.createElement('option');
        option.value = optionsNames[i];
        option.text = optionsNames[i];
        select.appendChild(option);
    }

    // Ripristina l'index per l'apertura
    if (selectedIndex >= 0 && selectedIndex < select.options.length) {
        select.selectedIndex = selectedIndex;
    }

    /* Pulsanti */
    let buttons = menu.querySelectorAll('div button');

    // Testo e funzione per ciascuno
    buttons[0].textContent = informations.menuNames[3];
    buttons[0].setAttribute('onclick', 'layPackage()');

    buttons[1].textContent = informations.menuNames[4];
    buttons[1].setAttribute('onclick', 'removeLaidPackage()');

    /* Attiva il menu */
    menu.classList.toggle('activeMenu');

    /* Update flag */
    openedMenuId = id;
}

//* Funzioni */
/* Metti / togli itinerario piazzato. __isFinal__ controlla se de'evessere oro o no */
function layPackage(__isFinal__) {
    /* Chiudi menu e barra laterale */
    __shouldNavbarExpand__ = false;
    toggleExpandedNavbar();

    /* Rimuove pacchetto già piazzato */
    removeLaidPackage();

    const selectedPackage = document.querySelector('#packagesMenu select').value;
    /* Prendi il 'pacchetto' da 'informations.itineraryNames' in base al parametro mandato */
    var packagePlacesList = informations.itineraryNames[selectedPackage];

    var places = [];
    packagePlacesList.forEach(element => {
        places.push(informations.placesNames[element]);
    });

    /* Preleva le coordinate da 'places' e le salva in 'waypoints' */
    waypoints = places.map((place) => {
        return place[0];
    });

    /* Preleva titoli */
    var titles = places.map((title) => { return title[1]; });

    /* Preleva rating */
    var ratings = places.map((rating) => { return rating[2]; });

    /* Preleva description */
    var descriptions = places.map((description) => { return description[3]; });

    /* Preleva imageLink */
    var imageLinks = places.map((imageLink) => { return imageLink[4]; });

    /* Aggiungi alla mappa */
    var pathColor = __isFinal__ ? '#D98E31' : 'red';     // Colore percorso
    currentPackageRouting = L.Routing.control({
        // Per ogni singolo 'waypoint'
        waypoints: waypoints,
        lineOptions: {
            styles: [{ color: pathColor, opacity: 0.8, weight: 4 }]
        },
        language: localStorage.getItem('currentLanguageID'),
        // Impostazioni per evitare 'dragging' dei waypoints e 'lines' (percorsi in rosso)
        draggableWaypoints: false,
        addWaypoints: false,
        // Classe del Widget (a destra)
        show: !__isFinal__,
        containerClassName: !__isFinal__ ? 'itineraryMenuWidget' : 'itineraryMenuWidgetHidden',
        // Effettiva creazione (_i è un contatore necessario alla funzione)
        createMarker: function (_i, waypoint) {
            var icon = __isFinal__ ? markerIconGold : markerIcon;    // Icona (normale o oro)

            // Base marker...
            var marker = L.marker(waypoint.latLng, {
                draggable: false,
                icon: icon
            });

            // ...con Tooltip...
            marker.bindTooltip(`${_i + 1}`, {
                permanent: true,
                direction: 'top',
                className: __isFinal__ ? 'packagesMarkersCustomTooltipsCompleted' : 'packagesMarkersCustomTooltips',
                offset: [-11, -16]
            }).openTooltip();

            // ...e Pop-up
            marker.bindPopup(
                // Info + bottone extra con testo dinamico
                bindPopupInfos(titles[_i], ratings[_i], descriptions[_i], imageLinks[_i]) +
                '<button class="popupCompletedButton textToSpeak" onclick="recreateCompletedRoute(' + (_i + 1) + ')">' +
                (_i == 0 ? informations.menuNames[5] :
                    _i == waypoints.length - 1 ? informations.menuNames[7] :
                        informations.menuNames[6]) +
                '</button>'
            );

            return marker;
        }
    }).addTo(map);
    
    /* Update flag */
    __isPackageLaid__ = true;


    /* Pop-up "Complimenti hai completato il percorso!" */
    if (!__isFinal__) {
        return;
    }


    var completedItineraryPopupContainer = document.getElementById("completedItineraryPopupContainer");
    var completedItineraryPopup = document.getElementById("completedItineraryPopup");
    completedItineraryPopup.innerHTML = informations.menuNames[28];

    completedItineraryPopupContainer.classList.toggle('isCompletedItineraryPopupShown');
    setTimeout(() => {
        completedItineraryPopupContainer.classList.toggle('isCompletedItineraryPopupShown');
    }, 2300);
    
    completedItineraryPopup.classList.toggle('isCompletedItineraryPopupShown');
    setTimeout(() => {
        completedItineraryPopup.classList.toggle('isCompletedItineraryPopupShown');
    }, 2000);

    /* Coriandoli */
    letThemRain();
}
function removeLaidPackage() {
    // Se non c'è un itinerario piazzato o non stiamo analizzando un itinerario, esci...
    if (!__isPackageLaid__ || !currentPackageRouting) {
        return;
    }
    // ...altrimenti, rimuovi il pacchetto piazzato a 'currentPackageRouting' e, se "__wasProgressMade__", allora rimuovi anche quello
    map.removeControl(currentPackageRouting);
    if (__wasProgressMade__) {
        map.removeControl(completedItinerarySegment);
    }

    // Resetta i valori
    __isPackageLaid__ = false;
    __wasProgressMade__ = false;
    currentPackageRouting = undefined;
}
/* Gestisce il completamento di un segmento (dato l'indice del marker) */
// TODO: Colore markers (sarà un'impresa molto ardua (non ce la farò))
function recreateCompletedRoute(index) {
    // Resetta il percorso ed esce se il pirla tenta di completare zero tappe (index == 1)
    if (index == 1) {
        layPackage(false);
        return;
    }

    // Se c'era già piazzato un segmento precedente, cancellalo
    if (__wasProgressMade__) {
        map.removeControl(completedItinerarySegment);
    }

    // Piazza oro se viene completata tutta, altrimenti verde
    if (index == waypoints.length) {
        layPackage(true);
        return;
    } else {
        layPackage(false);
        completedItinerarySegment = L.Routing.control({
            waypoints: waypoints.slice(0, index),   // I waypoint vanno dal primo (0) all'index
            routeWhileDragging: false,
            draggableWaypoints: false,
            addWaypoints: false,
            show: false,    // Niente Widget
            containerClassName: 'completedSegmentMenuWidget',
            lineOptions: {
                styles: [{ color: 'green', opacity: 1, weight: 5 }]
            },
            createMarker: function () { return null; }       // Niente markers
        }).addTo(map);
    }

    // Update flag
    __wasProgressMade__ = true;
}


//! Accessibilità menu
function accessibilityMenu() {
    let id = 'accessibilityMenu';

    /* Funzioni necessarie gestione menu */
    let menu = document.getElementById(id);
    let shouldThisMenuClose = handleMenuButtonPress(menu);
    if (shouldThisMenuClose == 'yes') { return; }

    /* Titolo */
    menu.querySelector('div').textContent = informations.menuNames[8];

    /* Opzioni */
    let options = document.getElementsByClassName('accessibility_text');

    options[0].textContent = informations.menuNames[9];
    options[1].textContent = informations.menuNames[10];
    options[2].textContent = informations.menuNames[11];
    options[3].textContent = informations.menuNames[12];

    /* Attiva il menu */
    menu.classList.toggle('activeMenu');

    /* Update flag */
    openedMenuId = id;
}


//! Settings menu
function settingsMenu() {
    let id = 'settingsMenu';

    /* Funzioni necessarie gestione menu */
    let menu = document.getElementById(id);
    let shouldThisMenuClose = handleMenuButtonPress(menu);
    if (shouldThisMenuClose == 'yes') { return; }

    /* Titolo */
    menu.querySelector('div:first-child').textContent = informations.menuNames[13];

    /* Legenda */
    document.getElementById('legendTitle').textContent = informations.menuNames[14];

    let legendContentTexts = document.getElementsByClassName('legendContentText');
    for (let i = 0; i < legendContentTexts.length; i++) {
        let legendContentText = legendContentTexts[i];
        legendContentText.textContent = informations.menuNames[i + 15];
    }

    /* Sezione 'cambia lingua' */
    let languageSwitch = document.getElementById('languageSwitch');
    languageSwitch.querySelector('span').textContent = informations.menuNames[18];

    /* Opzioni per il select (lista delle lingue da 'languagesList') */
    let select = languageSwitch.querySelector('select');

    for (let i = 0; i < languagesList.length; i++) {
        let isOptionPresent = false;

        for (let option of select.options) {
            if (option.value === languagesList[i] || option.text === languagesList[i]) {
                isOptionPresent = true;
                break;
            }
        }

        // Se non c'è aggiungila
        if (!isOptionPresent) {
            let option = document.createElement('option');
            option.value = languagesListID[i];
            option.text = languagesList[i];
            select.appendChild(option);
        }
    }
    // Trova l'elemento 'option' con il 'value' uguale a 'localStorage.getItem('currentLanguageID')'
    // e lo mette come selezionato
    Array.from(select.options).find(
        option => option.value === localStorage.getItem('currentLanguageID')
    ).selected = true;

    /* Attiva il menu */
    menu.classList.toggle('activeMenu');

    /* Controlla cambiamento lingua */
    languageChangeListener();

    /* Update flag */
    openedMenuId = id;
}

//* Funzioni */
/* Sente quando viene cambiata la lingua e chiama 'handleLanguageChange' per cambiarla */
function languageChangeListener() {
    // Rimuove il listener precedente (altrimenti rifarà il fetch esponenzialmente)
    document.querySelector('#languageSwitch select').removeEventListener('change', handleLanguageChange);

    // Aggiungine uno nuovo
    document.querySelector('#languageSwitch select').addEventListener('change', handleLanguageChange);
}
/* Gestisce il cambiamento della lingua */
function handleLanguageChange(event) {
    // Chiudi tutto per aggiornare la lingua
    singleMarkerMenuRemoveAll();
    removeLaidPackage();

    // Prendi le nuove informazioni (dato che ora abbiamo aggiornato 'currentLanguage' e 'currentLanguageID')
    fetchInfos(event.target.value);

    // Resetta il menu delle impostazioni
    resetSettingsMenu();
}

/* Reset del menu dopo aver cambiato lingua */
function resetSettingsMenu() {
    closeOpenMenus();
    setTimeout(() => {
        settingsMenu();
    }, 300);
}


//! Chi siamo? menu
function chiSiamoMenu() {
    let id = 'chiSiamoMenu';

    /* Funzioni necessarie gestione menu */
    let menu = document.getElementById(id);
    let shouldThisMenuClose = handleMenuButtonPress(menu);
    if (shouldThisMenuClose == 'yes') { return; }

    /* Titolo */
    menu.querySelector('div').textContent = informations.menuNames[19];

    /* La nostra bellissima presentazione */
    menu.querySelector('span').innerHTML = informations.menuNames[20];

    /* Attiva il menu */
    menu.classList.toggle('activeMenu');

    /* Update flag */
    openedMenuId = id;
}