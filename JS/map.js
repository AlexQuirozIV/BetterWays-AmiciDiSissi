/**
 * Script gestione mappa e menu... e tutto il resto
*/

"use strict";

//! Costante con 'LA MAPPA'
const map = L.map('map', {zoomControl: false}).setView([45.309062, 9.501200], 14);


//! Icona markers
function createMarkerIcon(url) {
    return L.icon({
        iconUrl: url,
    
        iconSize:     [48, 48],     // Grandezza icona
        iconAnchor:   [35, 60],     // Punto dell'icona che indicherà il punto preciso sulla mappa
        popupAnchor:  [-10, -60]    // Punto da dove il popup si apre
    });
}


//! Costanti globali
const markerIconDark = createMarkerIcon('../img/marker-icone/markerIcona-dark.png');
const markerIcon = createMarkerIcon('../img/marker-icone/markerIcona.png');
const menus = [                           // ID di ogni singolo menu esistente  //TODO: Aggiungere altri menu se mai verranno creati
    "addSingleMarkerMenu",
    "packagesMenu",
    "chiSiamoMenu",
    "accessibilityMenu",
    "settingsMenu",
    "accountMenu"
];
const languagesList = [                   // Lista lingue supportate
    "🇮🇹 - Italiano",
    "🇬🇧 - English",
    "🇫🇷 - Français",
    "🇪🇸 - Español",
    "🇩🇪 - Deutsch",
    "🇵🇹 - Português"
];


//! Variabili globali e flags
var openedMenuId;                       // Contiene l'id del menu aperto in quel momento
var availablePlace = [];                // Flag se il marker esiste già o no (prevenire spam)
var singleMarkers = [];                 // Contiene i singoli markers creati
var isPackageLaid = false;              // C'è un pacchetto iniziato?
var currentPackageRouting;              // Quale pacchetto è "piazzato"?
var information;                        // Contiene le informazioni presi dai JSON
var currentLanguage = languagesList[0]; // Lingua selezionata (default '-', ovvero Italiano)
var currentLanguageID = 'it';

//! Fetch e inizializzazione informazioni
/* Prendi informazioni dai JSON... */
async function fetchInfos(currentLanguage) {
    availablePlace = [];
    singleMarkers = [];
    currentPackageRouting = undefined;
    information = undefined;

    switch (currentLanguage) {
        case "🇮🇹 - Italiano":
            var response = await fetch('../JSON/languageTranslations/italiano.json');
            information = await response.json();
            availablePlaceLanguageRefill();

            break;
        
        case "🇬🇧 - English":
            var response = await fetch('../JSON/languageTranslations/english.json');
            information = await response.json();
            availablePlaceLanguageRefill();

            break;
        
        case "🇪🇸 - Español":
            var response = await fetch('../JSON/languageTranslations/espanol.json');
            information = await response.json();
            availablePlaceLanguageRefill();

            break;
        
        case "🇩🇪 - Deutsch":
            var response = await fetch('../JSON/languageTranslations/deutsch.json');
            information = await response.json();
            availablePlaceLanguageRefill();

            break;
        
        case "🇫🇷 - Français":
            var response = await fetch('../JSON/languageTranslations/francais.json');
            information = await response.json();
            availablePlaceLanguageRefill();

            break;
        
        case "🇵🇹 - Português":
            var response = await fetch('../JSON/languageTranslations/portugues.json');
            information = await response.json();
            availablePlaceLanguageRefill();

            break;
                        
        default:
            var response = await fetch('../JSON/languageTranslations/italiano.json');
            information = await response.json();
            availablePlaceLanguageRefill();

            break;
    }

    function availablePlaceLanguageRefill() {
        Object.keys(information.placesNames).forEach(place => {
            availablePlace.push(place);
        });
    }

    // Messaggio di successo
    console.log('Information fetched successfully for\n',
                (currentLanguage == undefined) ? "🇮🇹 - Italiano" : currentLanguage);
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
        [45.346958, 9.47382],
        [45.277182, 9.52927]
    ];

    // Funzioni necessarie (+ min e max zoom)
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        minZoom: 14,
        maxZoom: 19
    }).addTo(map);

    // Imposta limiti
    map.setMaxBounds(bounds);

    // Controlli zoom pulsanti
    L.control.zoom({
        position: 'topright'
    }).addTo(map);
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
    map.on('click', () => { closeOpenMenus(); });
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
    rating = '<div class="popupRating">' + rating + '</div>'
    
    return rating;
}
/* Genera le 'info' necessarie da aggiungere a ciascun popup tramite '.bindPopup(info)' */
function bindPopupInfos(title, rating, description, imageLink) {
    if (title === undefined || title == '') { title = 'Titolo inesistente'; }
    if (imageLink === undefined || imageLink == '') { imageLink = 'Torre-Zucchetti.jpg'; }
    if (description === undefined || description == '') { description = 'Descrizione di "' + title + '" inesistente'; }
    if (rating === undefined || rating < 0) { rating = 4; }

    imageLink = '<img src="' + imageLink + '" alt="' + title + '" style="color: white" class="popupImage">';
    title = '<p class="popupTitle">' + title + '</p>';
    rating = rate(rating);
    description = '<p class="popupDescription">' + description + '</p>';

    let info = title + rating + description + imageLink;
    return info;
}


//! Funzionalità menu
/* Chiudi tutti menu aperti */
function closeOpenMenus() {
    menus.forEach(menu => {
        document.getElementById(menu).classList.remove('activeMenu');
    });
}
/* Controlla se qualche menu è attivo, se lo è lo chiude */
function checkOpenMenuFlag() {
    if (openedMenuId != undefined) {
        closeOpenMenus();
    }
}
/* Toggle attivo / spento menu */
function handleMenuButtonPress(id) {
    let menu = document.getElementById(id);
    menu.classList.toggle('activeMenu');
}


//! Marker singoli
function addSingleMarkerMenu() {
    let id = 'addSingleMarkerMenu';
    let menu = document.getElementById(id);

    if (menu.classList.contains('activeMenu')) {
        handleMenuButtonPress(id);
        return;
    }
    checkOpenMenuFlag();


    /* Title */
    menu.querySelector('span').textContent = information.menuNames[0];

    /* Select options */
    let select = menu.querySelector('select');
    if (select.hasChildNodes()) {
        while (select.firstChild) {
            select.removeChild(select.firstChild);
        }
    }
    let optionsNames = Object.values(information.placesNames).map(array => array[1]);

    for (let i = 0; i < optionsNames.length; i++) {
        let option = document.createElement('option');
        option.value = availablePlace[i];
        option.text = optionsNames[i];
        select.appendChild(option);
    }

    /* Buttons */
    let buttons = menu.querySelectorAll('div button')

    buttons[0].textContent = information.menuNames[1];
    buttons[0].setAttribute('onclick', 'singleMarkerMenuPlace()');

    buttons[1].textContent = information.menuNames[2];
    buttons[1].setAttribute('onclick', 'singleMarkerMenuRemove()');

    buttons[2].textContent = information.menuNames[3];
    buttons[2].setAttribute('onclick', 'singleMarkerMenuAddAll()');

    buttons[3].textContent = information.menuNames[4];
    buttons[3].setAttribute('onclick', 'singleMarkerMenuRemoveAll()');

    /* Turn on class */
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
    let marker = L.marker([latitude, longitude], {icon: markerIcon}).addTo(map).bindPopup(info);

    // ... e in output per salvarlo in 'markers' nella funzione 'addSingleMarkerMenu'...
    return marker;
}
/* Metti / togli marker singolo piazzato */
function singleMarkerMenuPlace() {
    var selectedPlace = document.querySelector('#addSingleMarkerMenu select').value;
    
    // Crea il nuovo marker se non già piazzato e lo salva dentro 'markers'
    if (availablePlace.includes(selectedPlace)) {
        // La funzione 'newMarker' della mappa, prendendo info direttamente da 'places'
        var bindingInfos = bindPopupInfos(information.placesNames[selectedPlace][1],
                                          information.placesNames[selectedPlace][2],
                                          information.placesNames[selectedPlace][3],
                                          information.placesNames[selectedPlace][4]);

        singleMarkers[selectedPlace] = newSingleMarker(information.placesNames[selectedPlace][0], bindingInfos);
        // Quando un marker non dev'essere piazzato diventa 'null'
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
    if (availablePlace.every(element => element === null)) {
        return;
    }

    for (let i = 0; i < availablePlace.length; i++) {
        let marker = availablePlace[i];

        if (marker === null) {
            continue; // Skip to the next iteration if marker is null
        }

        // La funzione 'newMarker' della mappa, prendendo info direttamente da 'places'
        var bindingInfos = bindPopupInfos(information.placesNames[marker][1],
                                          information.placesNames[marker][2],
                                          information.placesNames[marker][3],
                                          information.placesNames[marker][4]);

        singleMarkers[marker] = newSingleMarker(information.placesNames[marker][0], bindingInfos);
        // Quando un marker non dev'essere piazzato diventa 'null'
        availablePlace[i] = null;
    }
}
function singleMarkerMenuRemoveAll() {
    for (const marker in singleMarkers) {
        map.removeLayer(singleMarkers[marker]);
    }
    availablePlace = [];
    Object.keys(information.placesNames).forEach(place => {
        availablePlace.push(place);
    });
}


//! Account menu
function accountMenu() {
    let id = 'accountMenu';
    let menu = document.getElementById(id);

    if (menu.classList.contains('activeMenu')) {
        handleMenuButtonPress(id);
        return;
    }
    checkOpenMenuFlag();

    /* Title */
    menu.querySelector('div').textContent = information.menuNames[5];

    /* Turn on class */
    menu.classList.toggle('activeMenu');

    /* Update flag */
    openedMenuId = id;
}


//! Pacchetti
function packagesMenu() {
    let id = 'packagesMenu';
    let menu = document.getElementById(id);

    if (menu.classList.contains('activeMenu')) {
        handleMenuButtonPress(id);
        return;
    }
    checkOpenMenuFlag();

    /* Title */
    menu.querySelector('span').textContent = information.menuNames[6];

    /* Select options */
    let select = menu.querySelector('select');
    if (select.hasChildNodes()) {
        while (select.firstChild) {
            select.removeChild(select.firstChild);
        }
    }
    let optionsNames = Object.keys(information.itineraryNames);

    for (let i = 0; i < optionsNames.length; i++) {
        let option = document.createElement('option');
        option.value = optionsNames[i];
        option.text = optionsNames[i];
        select.appendChild(option);
    }

    /* Buttons */
    let buttons = menu.querySelectorAll('div button')

    buttons[0].textContent = information.menuNames[7];
    buttons[0].setAttribute('onclick', 'layPackage()');

    buttons[1].textContent = information.menuNames[8];
    buttons[1].setAttribute('onclick', 'removeLaidPackage()');

    /* Turn on class */
    menu.classList.toggle('activeMenu');

    /* Update flag */
    openedMenuId = id;
}

//* Funzioni */
/* Metti / togli itinerario piazzato */
function layPackage() {
    removeLaidPackage();

    const selectedPackage = document.querySelector('#packagesMenu select').value;
    /* Prendi il 'pacchetto' da 'const packages' in base al parametro mandato */
    var packagePlacesList = information.itineraryNames[selectedPackage];

    var places = [];
    packagePlacesList.forEach(element => {
        places.push(information.placesNames[element]);
    });

    /* Preleva le coordinate da 'packages' e le salva in 'waypoints' */
    var waypoints = places.map((place) => {
        return place[0]; // Coordinates are the first element in each place array
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
    currentPackageRouting = L.Routing.control({
        // Per ogni singolo 'waypoint'
        waypoints: waypoints,
        language: currentLanguageID,
        // Impostazioni per evitare 'dragging' dei waypoints e 'lines' (percorsi in rosso)
        draggableWaypoints: false,
        addWaypoints: false,
        // Effettiva creazione (_i e _n sono contatori necessari alla funzione)
        createMarker: function(_i, waypoint, _n) {
            var icon = _i === 0 ? markerIconDark :
                       _i === waypoints.length - 1 ? markerIconDark :
                       markerIcon;

            return L.marker(waypoint.latLng, {
                draggable: false,
                icon: icon
            }).bindPopup(bindPopupInfos(titles[_i], ratings[_i], descriptions[_i], imageLinks[_i])); // Aggiungi pop-ups
        }
    }).addTo(map);

    isPackageLaid = true;
}
function removeLaidPackage() {
    if (!isPackageLaid || !currentPackageRouting) {
        return;
    }

    map.removeControl(currentPackageRouting);

    isPackageLaid = false;
    currentPackageRouting = null;
}


//! Accessibilità menu
function accessibilityMenu() {
    let id = 'accessibilityMenu';
    let menu = document.getElementById(id);

    if (menu.classList.contains('activeMenu')) {
        handleMenuButtonPress(id);
        return;
    }
    checkOpenMenuFlag();

    /* Title */
    menu.querySelector('div').textContent = information.menuNames[9];

    /* Turn on class */
    menu.classList.toggle('activeMenu');

    /* Update flag */
    openedMenuId = id;
}


//! Settings menu
function settingsMenu() {
    let id = 'settingsMenu';
    let menu = document.getElementById(id);

    if (menu.classList.contains('activeMenu')) {
        handleMenuButtonPress(id);
        return;
    }
    checkOpenMenuFlag();

    /* Title */
    menu.querySelector('div:first-child').textContent = information.menuNames[10];

    /* Legend */
    document.getElementById('legendTitle').textContent = information.menuNames[11];

    let legendContentTexts = document.getElementsByClassName('legendContentText');
    for (let i = 0; i < legendContentTexts.length; i++) {
        let legendContentText = legendContentTexts[i];
        legendContentText.textContent = information.menuNames[i + 12];
    }

    /* Language Switch */
    let languageSwitch = document.getElementById('languageSwitch');
    languageSwitch.querySelector('span').textContent = information.menuNames[15];

    /* Select languages options */
    let select = languageSwitch.querySelector('select');

    for (let language of languagesList) {
        let isOptionPresent = false;
    
        // Check if the option is already present
        for (let option of select.options) {
            if (option.value === language || option.text === language) {
                isOptionPresent = true;
                break;
            }
        }
    
        // If the option is not present, add it
        if (!isOptionPresent) {
            let option = document.createElement('option');
            option.value = language;
            option.text = language;
            select.appendChild(option);
        }
    }

    /* Turn on class */
    menu.classList.toggle('activeMenu');

    /* Call necessary functions */
    languageChangeListener();

    /* Update flag */
    openedMenuId = id;
}

//* Funzioni */
/* Sente quando viene cambiata la lingua e la cambia effettivamente */
function languageChangeListener() {
    // Remove previous event listener if it exists
    document.querySelector('#languageSwitch select').removeEventListener('change', handleLanguageChange);

    // Add new event listener
    document.querySelector('#languageSwitch select').addEventListener('change', handleLanguageChange);
}
/* Gestisce il cambiamento della lingua */
function handleLanguageChange(event) {
    var selectedOption = event.target.value;
    currentLanguage = selectedOption;

    switch (selectedOption) {
        case "🇬🇧 - English":
            currentLanguageID = 'en';
            break;
        
        case "🇪🇸 - Español":
            currentLanguageID = 'es';
            break;

        case "🇩🇪 - Deutsch":
            currentLanguageID = 'de';
            break;
        
        case "🇫🇷 - Français":
            currentLanguageID = 'fr';
            break;

        case "🇵🇹 - Português":
            currentLanguageID = 'pt-BR';
            break;

        default:
            currentLanguageID = 'it';
            break;
    }

    
    singleMarkerMenuRemoveAll();
    removeLaidPackage();
    
    fetchInfos(currentLanguage);

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
    let menu = document.getElementById(id);

    if (menu.classList.contains('activeMenu')) {
        handleMenuButtonPress(id);
        return;
    }
    checkOpenMenuFlag();
    
    /* Title */
    menu.querySelector('div').textContent = information.menuNames[16];

    /* Presentation */
    menu.querySelector('span').innerHTML = information.menuNames[17];

    /* Turn on class */
    menu.classList.toggle('activeMenu');

    /* Update flag */
    openedMenuId = id;
}