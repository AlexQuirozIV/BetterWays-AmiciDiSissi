/**
 * Script gestione mappa
*/

"use strict";
const map = L.map('map', {zoomControl: false}).setView([45.309055, 9.501972], 14);
const places = {
    placesNames:    [
                        'Torre Zucchetti',
                        'IIS A. Volta'
                    ],
    placesCoords:   [
                        [45.301689, 9.492247],
                        [45.303372, 9.498577]
                    ],
    placesImages:   [
                        'img/tappe-popup/Torre-Zucchetti.jpg',
                        'img/tappe-popup/IIS-A-Volta.jpg'
                    ]
}
const markerIcon = L.icon({
    iconUrl: 'img/marker-icone/markerIcona.png',

    iconSize:     [64, 64], // Grandezza icona
    iconAnchor:   [30, 60], // Punto dell'icona che indicherà il punto preciso sulla mappa
    popupAnchor:  [0, -60] // Punto da dove il popup si apre
});

let leafletMap = {
    "initialize":   function() {
                        const bounds = [
                            [45.328609, 9.47382],
                            [45.289614, 9.52866]
                        ];

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
                
    "debugging":    function() {
                        map.on('click', onMapClick);

                        function onMapClick(e) {
                            console.log('Coordinates: ' + e.latlng);
                        }
                    },
    
    "newMarker":    function([latitude, longitude], title, imageLink) {
                        if(title === undefined) {
                            title = "Titolo";
                        }
                    
                        if(imageLink === undefined) {
                            imageLink = "img/icona.jpg";
                        }
                    
                        imageLink = "<img class='popupImage' src='" + imageLink + "' alt='" + title + "'>";
                        title = "<p class='popupTitle'>" + title + "</p><br>";
                    
                        let marker = L.marker([latitude, longitude], {icon: markerIcon}).addTo(map).bindPopup(title + imageLink);
                    
                        return marker;
                    }
};

document.body.onload = () => {
    console.log('Initializing map...');
    leafletMap.initialize();
    leafletMap.debugging();
};

// Flag se il marker esiste già o no (prevenire spam)
var availablePlace = [];
for(let i = 0; i < Object.keys(places).length; i++) {
    availablePlace.push(i);
}

// Contiene i marker creati
var markers = [];

// Menu aggiungi/rimuovi markers
function addMarkerMenu() {
    if(document.getElementById('addMarkerMenu') == null) {
        // Div contenitore
        var newDiv = document.createElement('div');
        newDiv.id = 'addMarkerMenu';

        // Bottone chiudi
        var closeButton = document.createElement('span');
        closeButton.className = 'material-icons';

        closeButton.innerHTML = 'close';
        
        newDiv.appendChild(closeButton);

        // Tendina di selezione
        var selectBox = document.createElement('select');

        places.placesNames.forEach( function(place) {
                                        let option = document.createElement('option');
                                        option.text = place;
                                        selectBox.add(option);
                                    });

        newDiv.appendChild(selectBox);

        // Bottoni flex-box
        var buttonWrapper = document.createElement('div');

        // Bottone invia
        var okButton = document.createElement('button');

        okButton.textContent = 'OK';
        
        buttonWrapper.appendChild(okButton);

        // Bottone rimuovi
        var cancelButton = document.createElement('button');

        cancelButton.textContent = 'Rimuovi';
        
        buttonWrapper.appendChild(cancelButton);
        
        newDiv.appendChild(buttonWrapper);

        // Aggiungi all'HTML
        document.body.appendChild(newDiv).offsetWidth;

        // Animazione entrata/uscita menu
        newDiv.style.transition = '0.2s ease';
        newDiv.style.transform = 'translate(-50%, -50%) scale(1)';

        // Chiudi menu (con animazione d'uscita)
        closeButton.addEventListener('click', () => {
            newDiv.style.transform = 'translate(-50%, -50%) scale(0)';
            setTimeout(function() {
                document.body.removeChild(newDiv);
            }, 300);
        });

        // Aggiungi marker
        okButton.addEventListener('click', () => {
            var selectedPlaceIndex = document.querySelector('#addMarkerMenu select').selectedIndex;

            if(availablePlace.includes(selectedPlaceIndex)) {
                markers[selectedPlaceIndex] = leafletMap.newMarker(places.placesCoords[selectedPlaceIndex],
                                                                   places.placesNames[selectedPlaceIndex],
                                                                   places.placesImages[selectedPlaceIndex]);

                availablePlace[selectedPlaceIndex] = -1;
            }
        });

        // Rimuovi marker
        cancelButton.addEventListener('click', () => {
            var selectedPlaceIndex = document.querySelector('#addMarkerMenu select').selectedIndex;
            
            if(!(availablePlace.includes(selectedPlaceIndex))) {
                map.removeLayer(markers[selectedPlaceIndex]);

                availablePlace[selectedPlaceIndex] = selectedPlaceIndex;
            }
        });
    }
}

// Menu impostazioni
function settingsMenu() {
    var newDiv = document.createElement('div');
    newDiv.id = 'settingsMenu';

    var accessibilityBtn = document.createElement('span');
    accessibilityBtn.className = 'material-icons';
    accessibilityBtn.textContent = 'accessibility_new';

    newDiv.appendChild(accessibilityBtn);


    document.body.appendChild(newDiv).offsetWidth;
}