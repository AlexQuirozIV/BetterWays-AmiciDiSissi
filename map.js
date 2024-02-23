/**
 * Script gestione mappa
*/
"use strict";

/** LA mappa (dichiarazione e fissata view) */
const map = L.map('map', {zoomControl: false}).setView([45.309055, 9.501972], 14);

/** Tappe - informazioni */
const places = {
placesCoords:       [
                        [45.301689, 9.492247],
                        [45.303372, 9.498577],
                        [45.305723, 9.499810]
                    ],
placesTitles:       [
                        'Torre Zucchetti',
                        'IIS A. Volta',
                        'Casa del Gelato'
                    ],
placesRatings:      [   // Numero di "stelle" piene
                        4,
                        2,
                        5
                    ],
placesDescriptions: [
                        'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
                        '',
                        'mmmmmh, buono il gelato'
                    ],
placesImages:       [
                        'Torre-Zucchetti.jpg',
                        'IIS-A-Volta.jpg',
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

/** Funzione mappa */
let leafletMap = {
"initialize":       function() {
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
                    },
"debugging":        function() {
                        // Clieck e output coordinate in console
                        map.on('click', (e) => {
                            console.log('[' + e.latlng.lat.toFixed(6) + ', ' + e.latlng.lng.toFixed(6) + ']');
                        });
                    },
"bindPopupInfos":   function(title, ratingCycles, description, imageLink) {
                        // Controlla che non siano vuoti...
                        if(title === undefined || title == '') {
                            title = 'Titolo inesistente';
                        }
                        if(imageLink === undefined || imageLink == '') {
                            imageLink = 'img/icona.jpg';
                        }
                        if(description === undefined || description == '') {
                            description = 'Descrizione di "' + title + '" inesistente';
                        }
                        if(ratingCycles === undefined || ratingCycles < 0) {
                            ratingCycles = 0;
                        }

                        // Imposta immagine
                        imageLink = '<img class="popupImage" src="img/tappe-popup/' + imageLink + '" alt="' + title + '">';

                        // Imposta titolo
                        title = '<p class="popupTitle">' + title + '</p>';

                        // Imposta "valutazione"
                        let rating = '';
                        for(let i = 0; i < ratingCycles; i++) {
                            rating += '<img src="img/popup-rating-stars/fullStar.png" class="popupStars">';
                        }
                        for(let i = 0; i < (5 - ratingCycles); i++) {
                            rating += '<img src="img/popup-rating-stars/emptyStar.png" class="popupStars">';
                        }
                        rating = '<div class="popupRating">' + rating + '</div>';

                        // Imposta descrizione
                        description = '<p class="popupDescription">' + description + '</p>';

                        // Output valori da usare nel 'bindPopup'
                        var all = title + rating + description + imageLink;
                        return all;
                    },
"newMarker":        function([latitude, longitude], info) {
                        if([latitude, longitude] == undefined) {
                            console.log('Impossibile piazzare marker: "' + title + '", coordinate inesistenti!');
                            return null;
                        }

                        // Crea marker...
                        let marker = L.marker([latitude, longitude], {icon: markerIcon}).addTo(map).bindPopup(info);
                    
                        // ... e in output per salvarlo in 'markers' nella funzione 'addMarkerMenu'...
                        return marker;
                    }
};


/** Inizializza mappa a caricamento pagina */
document.body.onload = () => {
    console.log('Initializing map...');
    leafletMap.initialize();
    leafletMap.debugging();
};

/** Flag se il marker esiste già o no (prevenire spam) */
var availablePlace = [];
for(let i = 0; i < places.placesCoords.length; i++) {
    availablePlace.push(i);
}

var markers = [];   // Contiene i markers creati

/** Menu aggiungi/rimuovi singoli markers */
function addMarkerMenu() {
    /* Previene spam del menu in sé */
    if(document.getElementById('addMarkerMenu') == null) {
        /* Div contenitore */
        var newDiv = document.createElement('div');
        newDiv.id = 'addMarkerMenu';

        /* Bottone chiudi */
        var closeButton = document.createElement('span');
        closeButton.className = 'material-icons';

        closeButton.innerHTML = 'close';
        
        newDiv.appendChild(closeButton);

        /* Tendina di selezione */
        var selectBox = document.createElement('select');

        // Aggiunge le opzioni una per una
        places.placesTitles.forEach( function(place) {
                                        let option = document.createElement('option');
                                        option.text = place;
                                        selectBox.add(option);
                                    });

        newDiv.appendChild(selectBox);

        /* Bottoni flex-box (per metterli in fila) */
        var buttonWrapper = document.createElement('div');

        /* Bottone 'invia' */
        var okButton = document.createElement('button');

        okButton.textContent = 'OK';
        
        buttonWrapper.appendChild(okButton);

        /* Bottone 'rimuovi' */
        var cancelButton = document.createElement('button');

        cancelButton.textContent = 'Rimuovi';
        
        buttonWrapper.appendChild(cancelButton);
        
        newDiv.appendChild(buttonWrapper);

        /* Aggiungi all'HTML */
        document.body.appendChild(newDiv).offsetWidth;

        /* Animazione entrata/uscita menu */
        newDiv.style.transition = '0.2s ease';
        newDiv.style.transform = 'translate(-50%, -50%) scale(1)';

        /* Chiudi menu (con animazione d'uscita) */
        closeButton.addEventListener('click', () => {
            newDiv.style.transform = 'translate(-50%, -50%) scale(0)';
            // Un po' di ritardo per l'animazione
            setTimeout(function() {
                document.body.removeChild(newDiv);
            }, 300);
        });

        /* Aggiungi marker */
        okButton.addEventListener('click', () => {
            var selectedPlaceIndex = document.querySelector('#addMarkerMenu select').selectedIndex;

            // Crea il nuovo marker se non già piazzato e lo salva dentro 'markers'
            if(availablePlace.includes(selectedPlaceIndex)) {
                // La funzione 'newMarker' della mappa, prendendo info direttamente da 'places'
                var bindingInfos = leafletMap.bindPopupInfos(places.placesTitles[selectedPlaceIndex],
                                                             places.placesRatings[selectedPlaceIndex],
                                                             places.placesDescriptions[selectedPlaceIndex],
                                                             places.placesImages[selectedPlaceIndex]);

                markers[selectedPlaceIndex] = leafletMap.newMarker(places.placesCoords[selectedPlaceIndex], bindingInfos);
                // Quando un marker non dev'essere piazzato diventa 'null'
                availablePlace[selectedPlaceIndex] = null;
            }
        });

        /* Rimuovi marker */
        cancelButton.addEventListener('click', () => {
            var selectedPlaceIndex = document.querySelector('#addMarkerMenu select').selectedIndex;
            
            // Se il marker non è piazzato, lo toglie
            if(!(availablePlace.includes(selectedPlaceIndex))) {
                map.removeLayer(markers[selectedPlaceIndex]);

                // Il valore viene ripristinato, invece di 'null'
                availablePlace[selectedPlaceIndex] = selectedPlaceIndex;
            }
        });
    }
}

/** Menu Settings :P */
var isSettingsMenuOpened = false;
function settingsMenu() {
    if(isSettingsMenuOpened == false) {
        /* Previene spam del menu in sé */
        var settingsMenu = document.getElementById('settingsMenu');
        /* Pulsanti interni */
        // Aggiungi pacchetto
        if(document.getElementById('package-btn') == null) {
            var packageBtn = document.createElement('span');
            packageBtn.className = 'material-icons';
            packageBtn.id = 'package-btn';
            packageBtn.textContent = 'location_on';
            settingsMenu.appendChild(packageBtn);
        }
        // Accessibilità
        if(document.getElementById('accessibility-btn') == null) {
            var accessibilityBtn = document.createElement('span');
            accessibilityBtn.className = 'material-icons';
            accessibilityBtn.id = 'accessibility-btn';
            accessibilityBtn.textContent = 'accessibility_new';       
            settingsMenu.appendChild(accessibilityBtn);
        }
        // Impostazioni
        if(document.getElementById('settings-btn') == null) {
            var settingsBtn = document.createElement('span');
            settingsBtn.className = 'material-icons';
            settingsBtn.id = 'settings-btn';
            settingsBtn.textContent = 'settings';      
            settingsMenu.appendChild(settingsBtn);
        }

        // Aggiungi all'HTML
        document.body.appendChild(settingsMenu).offsetWidth;

        // Update flag
        isSettingsMenuOpened = true;
    } else {
        var packageBtn = document.getElementById('package-btn').remove();
        var accessibilityBtn = document.getElementById('accessibility-btn').remove();
        var settingsBtn = document.getElementById('settings-btn').remove();

        // Update flag
        isSettingsMenuOpened = false;
    }
}



/** Pacchetti (WIP) | per adesso, in console: 'startPackage('Package 1');' */
const packages = {
/* 
    Per ogni pacchetto ci sono X array, uno per waypoint.
    Servono: 1) Coordinate 2) Titolo 3) Rating 4) Descrizione 5) Link all'immagine
*/
    "Package 1":[
                    [[45.301689, 9.492247],
                    'Torre Zucchetti',
                    4,
                    'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
                    'Torre-Zucchetti.jpg'],
                    
                    [[45.303372, 9.498577],
                    'IIS A. Volta',
                    2,
                    '',
                    'IIS-A-Volta.jpg'],
                    
                    [[45.305723, 9.499810],
                    'Casa del Gelato',
                    5,
                    'mmmmmh, buono il gelato',
                    'Casa-del-Gelato.jpg']
                ]
    // Più pacchetti da inserire
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
    var titles = places.map((title) => {
        return title[1];
    });

    /* Preleva rating */
    var ratings = places.map((rating) => {
        return rating[2];
    });

    /* Preleva description */
    var descriptions = places.map((description) => {
        return description[3];
    });

    /* Preleva imageLink */
    var imageLinks = places.map((imageLink) => {
        return imageLink[4];
    });

    /* Aggiungi alla mappa */
    L.Routing.control({
        // Per ogni singolo 'waypoint'
        waypoints: waypoints,
        // Impostazioni per evitare 'dragging' dei waypoints e 'lines' (percorsi in rosso)
        draggableWaypoints: false,
        addWaypoints: false,
        // Effettiva creazione (_i e _n sono contatori necessari alla funzione)
        createMarker: function(_i, waypoint, _n) {
            return L.marker(waypoint.latLng, {
                draggable: false,
                icon: markerIcon    // Paperelle :D
            }).bindPopup(leafletMap.bindPopupInfos(titles[_i], ratings[_i], descriptions[_i], imageLinks[_i])); // Aggiungi pop-ups
        }
    }).addTo(map);
}