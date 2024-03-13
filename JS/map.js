/**
 * Script gestione mappa
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

const markerIconDark = createMarkerIcon('img/marker-icone/markerIcona-dark.png');
const markerIcon = createMarkerIcon('img/marker-icone/markerIcona.png');


//! Variabili globali e flags
var openedMenuId;           // Contiene l'id del menu aperto in quel momento
var availablePlace = [];    // Flag se il marker esiste già o no (prevenire spam)
var singleMarkers = [];     // Contiene i singoli markers creati
var isPackageLaid = false;  // C'è un pacchetto iniziato?
var currentPackageRouting;  // Quale pacchetto è "piazzato"?
var places;                 // Contiene i "places" presi dal JSON
var packages;               // Contiene i "packages" presi dal JSON (riformattati, vedi il 'for' in "fetchPackages")
var menus = [               // ID di ogni singolo menu esistente  //TODO: Aggiungere altri menu se mai verranno creati
    "addMarkerMenu",
    "packagesMenu",
    "chiSiamoMenu",
    "accessibilityMenu",
    "settingsMenu",
    "accountMenu"
]

//! "places" e "packages" fetch e inizializzazione
/* Prendi "places" dal JSON... */
async function fetchPlaces() {
    try {
        const response = await fetch('JSON/places.json');
        places = await response.json();
        
        // Per "available place" (dev'essere assegnata qui in quanto globale)
        for (const key in places) {
            if (!(places.hasOwnProperty(key))) {
                break;
            }
            availablePlace.push(key);
        }

        // Messaggio di successo
        console.log('Places fetched successfully:', places);
    } catch (error) {
        // Qualcosa è andato storto :(
        console.error('Error fetching places data:', error);
    }
}
/* Prendi "packages" dal JSON e riformattali... */
async function fetchPackages() {
    try {
        const response = await fetch('JSON/packages.json');
        packages = await response.json();

        // Riassegna "packages" con i valori completi da "places" (non solo la key)
        for (const key in packages) {
            const values = packages[key].map(reference => places[reference]);
            packages[key] = values;
        }

        // Messaggio di successo
        console.log('Packages fetched successfully:', packages);
    } catch (error) {
        // Qualcosa è andato storto :(
        console.error('Error fetching packages data:', error);
    }
}

//* Attendiamo di aver preso i dati prima di procedere all'avvio della pagina... */
async function startWebsite() {
    await fetchPlaces();
    await fetchPackages();
}

startWebsite();


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
        maxZoom: 19
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
    // Click e output coordinate in console
    map.on('click', (e) => {
        console.log('[' + e.latlng.lat.toFixed(6) + ', ' + e.latlng.lng.toFixed(6) + ']');
    });
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
    if(imageLink === undefined || imageLink == '') { imageLink = 'Torre-Zucchetti.jpg'; }
    if(description === undefined || description == '') { description = 'Descrizione di "' + title + '" inesistente'; }
    if(rating === undefined || rating < 0) { rating = 4; }

    imageLink = '<img src="' + imageLink + '" alt="' + title + '" style="color: white" class="popupImage">';
    title = '<p class="popupTitle">' + title + '</p>';
    rating = rate(rating);
    description = '<p class="popupDescription">' + description + '</p>';

    let info = title + rating + description + imageLink;
    return info;
}


//! Utilità
/* Crea pulsanti con icona da Google + può assegnare un id + onClickFunction */
function createActionButton(iconName, id, onClickFunction) {
    let button = document.createElement('span');
    button.className = 'material-icons';
    button.id = id;
    button.setAttribute('onclick', onClickFunction);
    button.textContent = iconName;

    return button;
}

/* Chiudi tutti menu aperti se click sulla mappa */
function closeOpenMenus() {
    menus.forEach(menu => {
        closeMenu(menu);
    });
}

/* Chiudi singolo menu per ID */
function closeMenu(menu) {
    menu = document.getElementById(menu);

    if(menu === null) {
        return;
    }

    menu.style.transform = 'translate(-50%, -50%) scale(0)';
    setTimeout(function() {
        menu.remove();
    }, 300);

    openedMenuId = undefined;
}


//! Marker singoli
/* Menu marker singolo */
function addSingleMarkerMenu() {
    if(!(document.getElementById('addMarkerMenu') == null)) {
        closeMenu("addMarkerMenu");
        return;
    }
    if(openedMenuId != undefined) {
        closeOpenMenus();
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
    openedMenuId = menu.id;

    /* Animazione entrata/uscita menu */
    menu.style.transition = '0.2s ease';
    menu.style.transform = 'translate(-50%, -50%) scale(1)';
}

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
/* Menu pacchetti */
function packagesMenu() {
    if(!(document.getElementById('packagesMenu') == null)) {
        closeMenu("packagesMenu");
        return;
    }
    if(openedMenuId != undefined) {
        closeOpenMenus();
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
    okButton.textContent = 'Comincia';
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
    openedMenuId = menu.id;

    /* Animazione entrata/uscita menu */
    menu.style.transition = '0.2s ease';
    menu.style.transform = 'translate(-50%, -50%) scale(1)';
}

/* Metti / togli itinerario piazzato */
function layPackage() {
    removeLaidPackage();

    const selectedPackage = document.querySelector('#packagesMenu select').value;
    /* Prendi il 'pacchetto' da 'const packages' in base al parametro mandato */
    var places = packages[selectedPackage];

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
        language: 'it',
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
    if(!(document.getElementById('chiSiamoMenu') == null)) {
        closeMenu("chiSiamoMenu");
        return;
    }
    if(openedMenuId != undefined) {
        closeOpenMenus();
    }

    /* Div contenitore */
    var menu = document.createElement('div');
    menu.id = 'chiSiamoMenu';

    /* Titolo */
    var title = document.createElement('div');
    title.innerHTML = 'Il Nostro Team';
    menu.appendChild(title);

    /* Bottoni flex-box (per metterli in fila) */
    var description = document.createElement('span');
    description.innerHTML = `Benvenuti nel mondo di "<i>Better Ways</i>"! Siamo cinque studenti della classe 4ID dell'istituto IIS A. Volta di Lodi.
                             <br>Ci chiamiamo: Silvia Bollani, Alessandro Marano, Alexandru Quiroz, Matteo Scaratti e Linda Tessadori.
                             <br>Il nostro sito, "<i>Better Ways</i>", è incentrato sul turismo di Lodi, per scoprire le meraviglie che questa piccola città ha da offrire.`;
    menu.appendChild(description);

    /* Aggiungi all'HTML */
    document.body.appendChild(menu).offsetWidth;
    openedMenuId = menu.id;

    /* Animazione entrata/uscita menu */
    menu.style.transition = '0.2s ease';
    menu.style.transform = 'translate(-50%, -50%) scale(1)';
}

//! Accessibilità menu
function accessibilityMenu() {
    if(!(document.getElementById('accessibilityMenu') == null)) {
        closeMenu("accessibilityMenu");
        return;
    }
    if(openedMenuId != undefined) {
        closeOpenMenus();
    }

    /* Div contenitore */
    var menu = document.createElement('div');
    menu.id = 'accessibilityMenu';

    /* Titolo */
    var title = document.createElement('div');
    title.innerHTML = 'Accessibilità';
    menu.appendChild(title);

    /* Immagine */
    var image = document.createElement('img');
    image.setAttribute('src', 'img/work-in-progress.png');
    menu.appendChild(image);

    /* Aggiungi all'HTML */
    document.body.appendChild(menu).offsetWidth;
    openedMenuId = menu.id;

    /* Animazione entrata/uscita menu */
    menu.style.transition = '0.2s ease';
    menu.style.transform = 'translate(-50%, -50%) scale(1)';
}

//! Settings menu
function settingsMenu() {
    if(!(document.getElementById('settingsMenu') == null)) {
        closeMenu("settingsMenu");
        return;
    }
    if(openedMenuId != undefined) {
        closeOpenMenus();
    }

    /* Div contenitore */
    var menu = document.createElement('div');
    menu.id = 'settingsMenu';

    /* Titolo */
    var title = document.createElement('div');
    title.innerHTML = 'Impostazioni';
    menu.appendChild(title);

    /* Immagine */
    var image = document.createElement('img');
    image.setAttribute('src', 'img/work-in-progress.png');
    menu.appendChild(image);

    /* Aggiungi all'HTML */
    document.body.appendChild(menu).offsetWidth;
    openedMenuId = menu.id;

    /* Animazione entrata/uscita menu */
    menu.style.transition = '0.2s ease';
    menu.style.transform = 'translate(-50%, -50%) scale(1)';
}

//! Account menu
function accountMenu() {
    if(!(document.getElementById('accountMenu') == null)) {
        closeMenu("accountMenu");
        return;
    }
    if(openedMenuId != undefined) {
        closeOpenMenus();
    }

    /* Div contenitore */
    var menu = document.createElement('div');
    menu.id = 'accountMenu';

    /* Titolo */
    var title = document.createElement('div');
    title.innerHTML = 'Account';
    menu.appendChild(title);

    /* Immagine */
    var image = document.createElement('img');
    image.setAttribute('src', 'img/work-in-progress.png');
    menu.appendChild(image);

    /* Aggiungi all'HTML */
    document.body.appendChild(menu).offsetWidth;
    openedMenuId = menu.id;

    /* Animazione entrata/uscita menu */
    menu.style.transition = '0.2s ease';
    menu.style.transform = 'translate(-50%, -50%) scale(1)';
}