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
    "addMarkerMenu",
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


//! Chiusura menu
/* Chiudi tutti menu aperti se click sulla mappa */
function closeOpenMenus() {
    menus.forEach(menu => {
        closeMenu(menu);
    });
}
/* Chiudi singolo menu per ID */
function closeMenu(menu) {
    menu = document.getElementById(menu);

    if (menu === null) {
        return;
    }

    menu.style.transform = 'scale(0)';
    setTimeout(function() {
        menu.remove();
    }, 300);

    openedMenuId = undefined;
}


//! Marker singoli
function addSingleMarkerMenu() {
    if (!(document.getElementById('addMarkerMenu') == null)) {
        closeMenu("addMarkerMenu");
        return;
    }
    if (openedMenuId != undefined) {
        closeOpenMenus();
    }

    /* Div contenitore */
    var menu = document.createElement('div');
    menu.id = 'addMarkerMenu';

    /* Titolo */
    var title = document.createElement('span');
    title.innerHTML = information.menuNames[0];
    menu.appendChild(title);

    /* Tendina di selezione */
    var selectBox = document.createElement('select');
    var optionsNames = Object.values(information.placesNames).map(array => array[1]);

    for (let i = 0; i < optionsNames.length; i++) {
        let option = document.createElement('option');
        option.value = availablePlace[i];
        option.text = optionsNames[i];
        selectBox.add(option);
    }

    menu.appendChild(selectBox);

    /* Bottoni flex-box (per metterli in fila) */
    var buttonWrapper = document.createElement('div');

    // Bottone 'invia'
    var okButton = document.createElement('button');
    okButton.textContent = information.menuNames[1];
    okButton.setAttribute('onclick', 'singleMarkerMenuPlace()');
    buttonWrapper.appendChild(okButton);
    
    // Bottone 'rimuovi'
    var cancelButton = document.createElement('button');
    cancelButton.textContent = information.menuNames[2];
    cancelButton.setAttribute('onclick', 'singleMarkerMenuRemove()');
    buttonWrapper.appendChild(cancelButton);

    // Bottone 'aggiungi tutti'
    var addAllButton = document.createElement('button');
    addAllButton.textContent = information.menuNames[3];
    addAllButton.setAttribute('onclick', 'singleMarkerMenuAddAll()');
    buttonWrapper.appendChild(addAllButton);

    // Bottone 'rimuovi tutti'
    var cancelAllButton = document.createElement('button');
    cancelAllButton.textContent = information.menuNames[4];
    cancelAllButton.setAttribute('onclick', 'singleMarkerMenuRemoveAll()');
    buttonWrapper.appendChild(cancelAllButton);

    
    menu.appendChild(buttonWrapper);

    /* Aggiungi all'HTML */
    document.body.appendChild(menu).offsetWidth;
    openedMenuId = menu.id;

    /* Animazione entrata/uscita menu */
    menu.style.transition = '0.2s ease';
    menu.style.transform = 'scale(1)';
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

    // ... e in output per salvarlo in 'markers' nella funzione 'addMarkerMenu'...
    return marker;
}
/* Metti / togli marker singolo piazzato */
function singleMarkerMenuPlace() {
    var selectedPlace = document.querySelector('#addMarkerMenu select').value;
    
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
    var selectedPlace = document.querySelector('#addMarkerMenu select').value;
    
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


//! Pacchetti
function packagesMenu() {
    if (!(document.getElementById('packagesMenu') == null)) {
        closeMenu("packagesMenu");
        return;
    }
    if (openedMenuId != undefined) {
        closeOpenMenus();
    }

    /* Div contenitore */
    var menu = document.createElement('div');
    menu.id = 'packagesMenu';

    /* Titolo */
    var title = document.createElement('span');
    title.innerHTML = information.menuNames[6];
    menu.appendChild(title);

    /* Tendina di selezione */
    var selectBox = document.createElement('select');
    var optionsNames = Object.keys(information.itineraryNames);

    for (let i = 0; i < optionsNames.length; i++) {
        let option = document.createElement('option');
        option.value = optionsNames[i];
        option.text = optionsNames[i];
        selectBox.add(option);
    }

    menu.appendChild(selectBox);

    /* Bottoni flex-box (per metterli in fila) */
    var buttonWrapper = document.createElement('div');

    // Bottone 'invia'
    var okButton = document.createElement('button');
    okButton.textContent = information.menuNames[7];
    okButton.setAttribute('onclick', 'layPackage()');
    buttonWrapper.appendChild(okButton);
    
    // Bottone 'rimuovi'
    var cancelButton = document.createElement('button');
    cancelButton.textContent = information.menuNames[8];
    cancelButton.setAttribute('onclick', 'removeLaidPackage()');
    buttonWrapper.appendChild(cancelButton);
    
    menu.appendChild(buttonWrapper);

    /* Aggiungi all'HTML */
    document.body.appendChild(menu).offsetWidth;
    openedMenuId = menu.id;

    /* Animazione entrata/uscita menu */
    menu.style.transition = '0.2s ease';
    menu.style.transform = 'scale(1)';
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


//! Chi siamo? menu
function chiSiamoMenu() {
    if (!(document.getElementById('chiSiamoMenu') == null)) {
        closeMenu("chiSiamoMenu");
        return;
    }
    if (openedMenuId != undefined) {
        closeOpenMenus();
    }

    /* Div contenitore */
    var menu = document.createElement('div');
    menu.id = 'chiSiamoMenu';

    /* Titolo */
    var title = document.createElement('div');
    title.innerHTML = information.menuNames[16];
    menu.appendChild(title);

    /* Bottoni flex-box (per metterli in fila) */
    var description = document.createElement('span');
    description.innerHTML = information.menuNames[17];
    menu.appendChild(description);

    /* Aggiungi all'HTML */
    document.body.appendChild(menu).offsetWidth;
    openedMenuId = menu.id;

    /* Animazione entrata/uscita menu */
    menu.style.transition = '0.2s ease';
    menu.style.transform = 'scale(1)';
}

//! Accessibilità menu
function accessibilityMenu() {
    if (!(document.getElementById('accessibilityMenu') == null)) {
        closeMenu("accessibilityMenu");
        return;
    }
    if (openedMenuId != undefined) {
        closeOpenMenus();
    }

    /* Div contenitore */
    var menu = document.createElement('div');
    menu.id = 'accessibilityMenu';

    /* Titolo */
    var title = document.createElement('div');
    title.innerHTML = information.menuNames[9];
    menu.appendChild(title);

    /* Immagine */
    var image = document.createElement('img');
    image.setAttribute('src', '../img/work-in-progress.png');
    menu.appendChild(image);

    //TODO: tre div con uno span + [il pulsante boh non so che elemento sia]

    /* Aggiungi all'HTML */
    document.body.appendChild(menu).offsetWidth;
    openedMenuId = menu.id;

    /* Animazione entrata/uscita menu */
    menu.style.transition = '0.2s ease';
    menu.style.transform = 'scale(1)';
}

//! Settings menu
function settingsMenu() {
    if (!(document.getElementById('settingsMenu') == null)) {
        closeMenu("settingsMenu");
        return;
    }
    if (openedMenuId != undefined) {
        closeOpenMenus();
    }

    /* Div contenitore */
    var menu = document.createElement('div');
    menu.id = 'settingsMenu';

    /* Titolo */
    var menuTitle = document.createElement('div');
    menuTitle.innerHTML = information.menuNames[10];
    menu.appendChild(menuTitle);

    /* Legenda */
    var legend = document.createElement('div');
    legend.id = 'legend';

    var legendTitle = document.createElement('div');
    legendTitle.id = 'legendTitle';
    legendTitle.innerHTML = information.menuNames[11];
    legend.appendChild(legendTitle);

    var legendContent = document.createElement('div');
    legendContent.id = 'legendContent';

    var textLegend = [
        information.menuNames[12],
        information.menuNames[13],
        information.menuNames[14]
    ];

    for (let i = 0; i < textLegend.length; i++) {
        let container = document.createElement('div');
        let marker = document.createElement('span');
        marker.classList.add('material-symbols-outlined');
        marker.classList.add('legendContentIcon');
        marker.innerHTML = 'location_on';
        container.appendChild(marker);

        let text = document.createElement('span');
        text.classList.add('legendContentText');
        text.innerHTML = textLegend[i];
        container.appendChild(text);

        legendContent.appendChild(container);
    }
    legend.appendChild(legendContent);

    menu.appendChild(legend);

    /* Lingue */
    var languageSwitch = document.createElement('div');
    languageSwitch.id = 'languageSwitch';
    var languageSwitchTitle = document.createElement('span');
    languageSwitchTitle.innerHTML = information.menuNames[15];
    languageSwitch.appendChild(languageSwitchTitle);

    var selectLanguages = document.createElement('select');
    let i = 0;
    languagesList.forEach(language => {
        let option = document.createElement('option');
        option.value = language;
        option.text = languagesList[i];
        selectLanguages.add(option);
        i++;
    });

    selectLanguages.selectedIndex = languagesList.indexOf(currentLanguage);

    languageSwitch.appendChild(selectLanguages);

    menu.appendChild(languageSwitch);
    
    
    /* Aggiungi all'HTML */
    document.body.appendChild(menu).offsetWidth;
    openedMenuId = menu.id;

    /* Animazione entrata/uscita menu */
    menu.style.transition = '0.2s ease';
    menu.style.transform = 'scale(1)';

    languageChangeListener();
}

//* Funzioni */
/* Sente quando viene cambiata la lingua e la cambia effettivamente */
function languageChangeListener() {
    if (document.querySelector('#languageSwitch select') == currentLanguage) {
        return;
    }
    
    document.querySelector('#languageSwitch select').addEventListener('change', function(event) {
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
    });
}
/* Reset del menu dopo aver cambiato lingua */
function resetSettingsMenu() {
    closeMenu('settingsMenu');
    setTimeout(() => {
        settingsMenu();
    }, 300);
}

//! Account menu
function accountMenu() {
    if (!(document.getElementById('accountMenu') == null)) {
        closeMenu("accountMenu");
        return;
    }
    if (openedMenuId != undefined) {
        closeOpenMenus();
    }

    /* Div contenitore */
    var menu = document.createElement('div');
    menu.id = 'accountMenu';

    /* Titolo */
    var title = document.createElement('div');
    title.innerHTML = information.menuNames[5];
    menu.appendChild(title);

    /* Immagine */
    var image = document.createElement('img');
    image.setAttribute('src', '../img/work-in-progress.png');
    menu.appendChild(image);

    /* Aggiungi all'HTML */
    document.body.appendChild(menu).offsetWidth;
    openedMenuId = menu.id;

    /* Animazione entrata/uscita menu */
    menu.style.transition = '0.2s ease';
    menu.style.transform = 'scale(1)';
}