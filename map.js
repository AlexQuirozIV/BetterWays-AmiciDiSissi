/**
 * Script gestione mappa
*/
"use strict";

//! Costante con 'LA MAPPA'
const map = L.map('map', {zoomControl: false}).setView([45.309062, 9.501200], 14);

//! Informazioni tappe
const places = {
    "Parco-Adda-Sud": [
        [45.314040272551736, 9.498271300674975],
        "Parco Adda Sud",
        5,
        '',
        ''
    ],
    "Duomo-di-Lodi": [
        [45.314214319510235, 9.503150096251492],
        "Duomo di Lodi",
        5,
        '',
        ''
    ],
    "Parco-Isola-Carolina": [
        [45.315097006869266, 9.498896680791935],
        "Parco dell'Isola Carolina",
        5,
        '',
        ''
    ],
    "Parco-Villa-Braila": [
        [45.30376301489828, 9.508691843847435],
        "Parco Villa Braila",
        5,
        '',
        ''
    ],
    "Museo-della-Stampa": [
        [45.31796325796598, 9.502647436164928],
        "Museo della Stampa",
        5,
        '',
        ''
    ],
    "Museo-dello-Strumento-Musicale-&-della-Musica": [
        [45.30701338770822, 9.50199549913424],
        "Museo dello Strumento Musicale & della Musica",
        5,
        '',
        ''
    ],
    "Teatro-Alle-Vigne": [
        [45.31506910520015, 9.506154729318768],
        "Teatro Alle Vigne",
        5,
        '',
        ''
    ],
    "Teatro-civico-Incoronata": [
        [45.31465971960593, 9.502055674244136],
        "Teatro Civico dell'Incoronata",
        5,
        '',
        ''
    ],
    "Monumento-alla-Resistenza": [
        [45.31043780366223, 9.501946341831502],
        "Monumento alla Resistenza",
        5,
        '',
        ''
    ],
    "Museo-di-Paolo-Gorini": [
        [45.3138348117735, 9.508056454515657],
        "Museo di Paolo Gorini",
        5,
        '',
        ''
    ],
    "Chiesa-di-San-Francesco": [
        [45.314617754968054, 9.507929720552477],
        "Chiesa di San Francesco",
        5,
        '',
        ''
    ],
    "Castello-Visconteo": [
        [45.312376641034014, 9.498816848941937],
        "Castello Visconteo",
        5,
        '',
        ''
    ],
    "Torrione-di-Lodi": [
        [45.3126397552172, 9.498001343678204],
        "Torrione di Lodi",
        5,
        '',
        ''
    ],
    "Stadio-Dossenina": [
        [45.30739132224016, 9.495022000717784],
        "Stadio Dossenina",
        5,
        '',
        ''
    ],
    "Faustina-Sporting-Club": [
        [45.300695861177324, 9.506869003676572],
        "Faustina Sporting Club",
        5,
        '',
        ''
    ],
    "Palazzetto-Palacastellotti": [
        [45.297359483089814, 9.510770296119013],
        "Palazzetto Palacastellotti",
        5,
        '',
        ''
    ]
}

//! Icona markers
const markerIcon = L.icon({
    iconUrl: 'img/marker-icone/markerIcona.png',

    iconSize:     [48, 48], // Grandezza icona
    iconAnchor:   [35, 60], // Punto dell'icona che indicherà il punto preciso sulla mappa
    popupAnchor:  [-10, -60]  // Punto da dove il popup si apre
});


//! Funzioni mappa
/* Inizializza 'onLoad' */
function initializeMap() {
    const bounds = [
        [45.328609, 9.47382],
        [45.289614, 9.52866]
    ];

    // Funzioni necessarie (+ min e max zoom)
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        minZoom: 14,
        maxZoom: 18
    }).addTo(map);

    // Imposta limiti
    map.setMaxBounds(bounds);

    // Controlli zoom pulsanti
    L.control.zoom({
        position: 'topright'
    }).addTo(map);
}

/* Per debugging */
function coordinatesOnClick() {
    // Clieck e output coordinate in console
    map.on('click', (e) => {
        console.log('[' + e.latlng.lat.toFixed(6) + ', ' + e.latlng.lng.toFixed(6) + ']');
    });
}

/* Chiudi tutti menu aperti se click sulla mappa */
//TODO: Aggiungere altri menu se mai verranno creati
function closeOpenMenus() {
    map.on('click', () => {
        if(document.getElementById('packagesMenu') != null) {
            closePackagesMenu();
        }
        if(document.getElementById('addMarkerMenu') != null) {
            closeAddSingleMarkerMenu();
        }
    });
}

/* Avvia mappa a caricamento pagina */
document.body.onload = () => {
    console.log('Initializing map...');
    initializeMap();
    coordinatesOnClick();
    closeOpenMenus();
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

//! Utilità
// Crea pulsanti con icona da Google + può assegnare un id + onClickFunction
function createActionButton(iconName, id, onClickFunction) {
    let button = document.createElement('span');
    button.className = 'material-icons';
    button.id = id;
    button.setAttribute('onclick', onClickFunction);
    button.textContent = iconName;

    return button;
}

//! Marker singoli
/* Menu marker singolo -> apri & chiudi */
function addSingleMarkerMenu() {
    if(!(document.getElementById('addMarkerMenu') == null)) {
        closeAddSingleMarkerMenu();
        return;
    }
    /* Div contenitore */
    var menu = document.createElement('div');
    menu.id = 'addMarkerMenu';

    /* Titolo */
    var title = document.createElement('span');
    title.innerHTML = 'Marker Singoli';
    menu.appendChild(title);

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

    // Bottone 'aggiungi tutti'
    var addAllButton = document.createElement('button');
    addAllButton.textContent = 'Aggiungi tutti';
    addAllButton.setAttribute('onclick', 'singleMarkerMenuAddAll()');
    buttonWrapper.appendChild(addAllButton);

    // Bottone 'rimuovi tutti'
    var cancelAllButton = document.createElement('button');
    cancelAllButton.textContent = 'Rimuovi tutti';
    cancelAllButton.setAttribute('onclick', 'singleMarkerMenuRemoveAll()');
    buttonWrapper.appendChild(cancelAllButton);

    
    menu.appendChild(buttonWrapper);

    /* Aggiungi all'HTML */
    document.body.appendChild(menu).offsetWidth;

    /* Animazione entrata/uscita menu */
    menu.style.transition = '0.2s ease';
    menu.style.transform = 'translate(-50%, -50%) scale(1)';
}
function closeAddSingleMarkerMenu() {
    document.getElementById('addMarkerMenu').style.transform = 'translate(-50%, -50%) scale(0)';
    setTimeout(function() {
        document.getElementById('addMarkerMenu').remove();
    }, 300);
}

var availablePlace = [];    // Flag se il marker esiste già o no (prevenire spam)
for (const key in places) {
    if (!(places.hasOwnProperty(key))) {
        break;
    }
    availablePlace.push(key);
}
var singleMarkers = [];   // Contiene i singoli markers creati
/* Genera un singolo marker */
function newSingleMarker([latitude, longitude], info) {
    if([latitude, longitude] == undefined) {
        console.log('Impossibile piazzare marker, coordinate inesistenti!');
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
        var bindingInfos = bindPopupInfos(places[marker][1],
                                          places[marker][2],
                                          places[marker][3],
                                          places[marker][4]);

        singleMarkers[marker] = newSingleMarker(places[marker][0], bindingInfos);
        // Quando un marker non dev'essere piazzato diventa 'null'
        availablePlace[i] = null;
    }
}
function singleMarkerMenuRemoveAll() {
    for(const marker in singleMarkers) {
        map.removeLayer(singleMarkers[marker]);
    }
    availablePlace = [];
    for (const key in places) {
        if (!(places.hasOwnProperty(key))) {
            break;
        }
        availablePlace.push(key);
    }
}

//! Pacchetti
const packages = {
    // L'ordine va da inizio a fine, ovviamente
    // La 'key' sarà mostrata nel menu di select
    "Parchi": [
        places["Parco-Adda-Sud"],
        places["Parco-Isola-Carolina"],
        places["Parco-Villa-Braila"]
    ],
    "Musei & Teatri": [
        places["Museo-della-Stampa"],
        places["Museo-di-Paolo-Gorini"],
        places["Teatro-Alle-Vigne"],
        places["Museo-dello-Strumento-Musicale-&-della-Musica"]
    ],
    "Monumenti Onoranti": [
        places["Monumento-alla-Resistenza"]             // ! Uno solo non va!!!
    ],
    "Religione": [
        places["Duomo-di-Lodi"],
        places["Teatro-civico-Incoronata"],
        places["Chiesa-di-San-Francesco"]
    ],
    "Castelli": [
        places["Castello-Visconteo"],
        places["Torrione-di-Lodi"]
    ],
    "Strutture Sportive": [
        places["Stadio-Dossenina"],
        places["Faustina-Sporting-Club"],
        places["Palazzetto-Palacastellotti"]
    ],
}

/* Menu pacchetti -> apri & chiudi */
function packagesMenu() {
    if(!(document.getElementById('packagesMenu') == null)) {
        closePackagesMenu();
        return;
    }
    /* Div contenitore */
    var menu = document.createElement('div');
    menu.id = 'packagesMenu';

    /* Titolo */
    var title = document.createElement('span');
    title.innerHTML = 'Itinerari';
    menu.appendChild(title);

    /* Tendina di selezione */
    var selectBox = document.createElement('select');
    for(const pack in packages) {
        let option = document.createElement('option');
        option.value = pack;
        option.text = pack;
        selectBox.add(option);
    }

    menu.appendChild(selectBox);

    /* Bottoni flex-box (per metterli in fila) */
    var buttonWrapper = document.createElement('div');

    // Bottone 'invia'
    var okButton = document.createElement('button');
    okButton.textContent = 'OK';
    okButton.setAttribute('onclick', 'layPackage()');
    buttonWrapper.appendChild(okButton);
    
    // Bottone 'rimuovi'
    var cancelButton = document.createElement('button');
    cancelButton.textContent = 'Rimuovi';
    cancelButton.setAttribute('onclick', 'removeLaidPackage()');
    buttonWrapper.appendChild(cancelButton);
    
    menu.appendChild(buttonWrapper);

    /* Aggiungi all'HTML */
    document.body.appendChild(menu).offsetWidth;

    /* Animazione entrata/uscita menu */
    menu.style.transition = '0.2s ease';
    menu.style.transform = 'translate(-50%, -50%) scale(1)';
}
function closePackagesMenu() {
    document.getElementById('packagesMenu').style.transform = 'translate(-50%, -50%) scale(0)';
    setTimeout(function() {
        document.getElementById('packagesMenu').remove();
    }, 300);
}

/* Metti / togli itinerario piazzato */
var isPackageLaid = false;
var currentPackageRouting;
function layPackage() {
    removeLaidPackage();

    const selectedPackage = document.querySelector('#packagesMenu select').value;
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
    currentPackageRouting = L.Routing.control({
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
