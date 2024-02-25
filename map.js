/**
 * Script gestione mappa
*/
"use strict";

/** LA mappa (dichiarazione e fissata view) */
const map = L.map('map', {zoomControl: false}).setView([45.309062, 9.501200], 14);

/** Tappe - informazioni */
const places = {
    "Torre-Zucchetti": [
        [45.301689, 9.492247],
        'Torre Zucchetti',
        4,
        'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
        'Torre-Zucchetti.jpg'
    ],
    "IIS-A-Volta": [
        [45.303372, 9.498577],
        'IIS A. Volta',
        2,
        '',
        'IIS-A-Volta.jpg'
    ],
    "Casa-del-Gelato": [
        [45.305723, 9.499810],
        'Casa del Gelato',
        5,
        'mmmmmh, buono il gelato',
        'Casa-del-Gelato.jpg'
    ]
}

/** Icona markers */
const markerIcon = L.icon({
    iconUrl: 'img/marker-icone/markerIcona.png',

    iconSize:     [32, 64], // Grandezza icona
    iconAnchor:   [15, 60], // Punto dell'icona che indicherà il punto preciso sulla mappa
    popupAnchor:  [0, -60]  // Punto da dove il popup si apre
});

/** Funzioni mappa */
/* Inizializza 'onLoad' */
function initializeMap() {
    const bounds = [
        [45.328609, 9.47382],
        [45.289614, 9.52866]
    ];

    // Funzioni necessarie (+ min e max zoom)
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        minZoom: 14,
        maxZoom: 18,
        attribution: '<a target="_blank" href="https://google.com">&copy</a>'
    }).addTo(map);

    // Imposta limiti
    map.setMaxBounds(bounds);

    // Controlli zoom pulsanti
    L.control.zoom({
        position: 'bottomleft'
    }).addTo(map);
}

/* Per debugging */
function coordinatesOnClick() {
    // Clieck e output coordinate in console
    map.on('click', (e) => {
        console.log('[' + e.latlng.lat.toFixed(6) + ', ' + e.latlng.lng.toFixed(6) + ']');
    });
}

document.body.onload = () => {
    console.log('Initializing map...');
    initializeMap();
    coordinatesOnClick();
};

/* Genera 'div' con 'img' in base al valore inserito sono 'piene' o no (necessaria per 'bindPopupInfos') */
function rate(fullStarsNumber) {
    let rating = '';
    for(let i = 0; i < fullStarsNumber; i++) {
        rating += '<img src="img/popup-rating-stars/fullStar.png" class="popupStars">';
    }
    for(let i = 0; i < (5 - fullStarsNumber); i++) {
        rating += '<img src="img/popup-rating-stars/emptyStar.png" class="popupStars">';
    }
    rating = '<div class="popupRating">' + rating + '</div>'
    
    return rating;
}
/* Genera le 'info' necessarie da aggiungere a ciascun popup tramite '.bindPopup(info)' */
function bindPopupInfos(title, rating, description, imageLink) {
    if(title === undefined || title == '') { title = 'Titolo inesistente'; }
    if(imageLink === undefined || imageLink == '') { imageLink = 'img/icona.jpg'; }
    if(description === undefined || description == '') { description = 'Descrizione di "' + title + '" inesistente'; }
    if(rating === undefined || rating < 0) { rating = 0; }

    imageLink = '<img class="popupImage" src="img/tappe-popup/' + imageLink + '" alt="' + title + '">';
    title = '<p class="popupTitle">' + title + '</p>';
    rating = rate(rating);
    description = '<p class="popupDescription">' + description + '</p>';

    let info = title + rating + description + imageLink;
    return info;
}

/** Markers */
/* Genera un singolo marker */
function newSingleMarker([latitude, longitude], info) {
    if([latitude, longitude] == undefined) {
        console.log('Impossibile piazzare marker: "' + title + '", coordinate inesistenti!');
        return null;
    }

    // Crea marker...
    let marker = L.marker([latitude, longitude], {icon: markerIcon}).addTo(map).bindPopup(info);

    // ... e in output per salvarlo in 'markers' nella funzione 'addMarkerMenu'...
    return marker;
}

/* Menu aggiungi/rimuovi singoli markers */
var availablePlace = [];    // Flag se il marker esiste già o no (prevenire spam)
for (const key in places) {
    if (!(places.hasOwnProperty(key))) {
        break;
    }
    availablePlace.push(key);
}
var singleMarkers = [];   // Contiene i singoli markers creati

function addSingleMarkerMenu() {
    if(!(document.getElementById('addMarkerMenu') == null)) {
        return;
    }
    /* Div contenitore */
    var menu = document.createElement('div');
    menu.id = 'addMarkerMenu';

    /* Bottone chiudi */
    var closeButton = createActionButton('close');
    menu.appendChild(closeButton);

    /* Tendina di selezione */
    var selectBox = document.createElement('select');
    for (const key in places) {
        if (!(places.hasOwnProperty(key))) {
            break;
        }
        let option = document.createElement('option');
        option.value = key;
        option.text = places[key][1];
        selectBox.add(option);
    }

    menu.appendChild(selectBox);

    /* Bottoni flex-box (per metterli in fila) */
    var buttonWrapper = document.createElement('div');

    // Bottone 'invia'
    var okButton = document.createElement('button');
    okButton.textContent = 'OK';
    okButton.setAttribute('onclick', 'singleMarkerMenuPlace()');
    buttonWrapper.appendChild(okButton);
    
    // Bottone 'rimuovi'
    var cancelButton = document.createElement('button');
    cancelButton.textContent = 'Rimuovi';
    cancelButton.setAttribute('onclick', 'singleMarkerMenuRemove()');
    buttonWrapper.appendChild(cancelButton);
    
    menu.appendChild(buttonWrapper);

    /* Aggiungi all'HTML */
    document.body.appendChild(menu).offsetWidth;

    /* Animazione entrata/uscita menu */
    menu.style.transition = '0.2s ease';
    menu.style.transform = 'translate(-50%, -50%) scale(1)';

    /* Chiudi menu (con animazione d'uscita) */
    closeButton.addEventListener('click', () => {
        menu.style.transform = 'translate(-50%, -50%) scale(0)';
        // Un po' di ritardo per l'animazione
        setTimeout(function() {
            document.body.removeChild(menu);
        }, 300);
    });
}
function singleMarkerMenuPlace() {
    var selectedPlace = document.querySelector('#addMarkerMenu select').value;
    
    // Crea il nuovo marker se non già piazzato e lo salva dentro 'markers'
    if(availablePlace.includes(selectedPlace)) {
        // La funzione 'newMarker' della mappa, prendendo info direttamente da 'places'
        var bindingInfos = bindPopupInfos(places[selectedPlace][1],
                                          places[selectedPlace][2],
                                          places[selectedPlace][3],
                                          places[selectedPlace][4]);

        singleMarkers[selectedPlace] = newSingleMarker(places[selectedPlace][0], bindingInfos);
        // Quando un marker non dev'essere piazzato diventa 'null'
        availablePlace[availablePlace.indexOf(selectedPlace)] = null;
    }
}
function singleMarkerMenuRemove() {
    var selectedPlace = document.querySelector('#addMarkerMenu select').value;
    
    // Se il marker non è piazzato, lo toglie
    if(!(availablePlace.includes(selectedPlace))) {
        map.removeLayer(singleMarkers[selectedPlace]);

        // Il valore viene ripristinato, invece di 'null'
        availablePlace[availablePlace.indexOf(null)] = selectedPlace;
    }
}


/** Menu Settings :P */
var isSettingsMenuOpened = false;
function settingsMenu() {
    const buttons = [
     // 'Id', 'Google icon name', 'onClickFunction' //TODO: Aggiungere funzioni
        ['location_on', 'package-btn', ''],
        ['accessibility_new', 'accessibility-btn', ''],
        ['settings', 'settings-btn', '']
    ];

    if(isSettingsMenuOpened == true) {
        for(let i = 0; i < buttons.length; i++) {
            document.getElementById(buttons[i][1]).remove();
        }
        isSettingsMenuOpened = false;
        return;
    }

    var settingsMenu = document.getElementById('settingsMenu');
    for(let i = 0; i < buttons.length; i++) {
        let button = createActionButton(buttons[i][0], buttons[i][1], buttons[i][2]);
        settingsMenu.appendChild(button);
    }

    document.body.appendChild(settingsMenu).offsetWidth;
    isSettingsMenuOpened = true;
}

/** Utils */
// Crea pulsanti con icona da Google + può assegnare un id
function createActionButton(iconName, id, onClickFunction) {
    var button = document.createElement('span');
    button.className = 'material-icons';
    button.id = id;
    button.setAttribute('onclick', onClickFunction);
    button.textContent = iconName;

    return button;
}

/** Pacchetti (WIP) | per adesso, in console: //!'startPackage('Package 1');' */
const packages = {
    // L'ordine va da inizio a fine, ovviamente
    "Package 1":[
        places["Torre-Zucchetti"],
        places["IIS-A-Volta"],
        places["Casa-del-Gelato"]
    ]
    // TODO: Più pacchetti da inserire
}

function startPackage(selectedPackage) {
    /* Prendi il 'pacchetto' da 'const packages' in base al parametro mandato */
    var places = packages[selectedPackage];

    /* Preleva le coordinate da 'packages' e le salva in 'waypoints' */
    var waypoints = places.map((place) => {
        var latLng = L.latLng(place[0][0], place[0][1]);
        return latLng;
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
    L.Routing.control({
        // Per ogni singolo 'waypoint'
        waypoints: waypoints,
        language: 'it',
        // Impostazioni per evitare 'dragging' dei waypoints e 'lines' (percorsi in rosso)
        draggableWaypoints: false,
        addWaypoints: false,
        // Effettiva creazione (_i e _n sono contatori necessari alla funzione)
        createMarker: function(_i, waypoint, _n) {
            return L.marker(waypoint.latLng, {
                draggable: false,
                icon: markerIcon    // Paperelle :D
            }).bindPopup(bindPopupInfos(titles[_i], ratings[_i], descriptions[_i], imageLinks[_i])); // Aggiungi pop-ups
        }
    }).addTo(map);
}