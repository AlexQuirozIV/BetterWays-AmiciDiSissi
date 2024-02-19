/**
 * Script gestione mappa
*/

"use strict";
const map = L.map('map', {zoomControl: false}).setView([45.312881, 9.497850], 14);

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
    
    "newMarker":    function(latitude, longitude, title, imageLink) {
                        if(title === undefined) {
                            title = "Titolo";
                        }
                    
                        if(imageLink === undefined) {
                            imageLink = "img/icona.jpg";
                        }
                    
                        title = "<p class='popupTitle'>" + title + "</p><br>";
                        imageLink = "<img class='popupImage' src='" + imageLink + "'>";
                    
                        let marker = L.marker([latitude, longitude]).addTo(map).bindPopup(title + imageLink);
                    
                        return marker;
                    }
};

document.body.onload = () => {
    console.log('Initializing map...');
    leafletMap.initialize();
    leafletMap.debugging();
};

let zucchetti = leafletMap.newMarker(45.301689, 9.492247);