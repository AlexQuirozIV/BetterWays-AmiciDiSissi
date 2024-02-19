/**
 * Script gestione mappa
*/

"use strict";
const map = L.map('map', {zoomControl: false}).setView([45.312881, 9.497850], 14);

let leafletMap = {
    initialize: function() {
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
                
    debugging:  function () {
                    map.on('click', onMapClick);

                    function onMapClick(e) {
                        console.log('Coordinates: ' + e.latlng);
                    }
                }

    // Funzioni extra da aggiungere qui (dopo inizializzazione)
};

document.body.onload = () => {
    console.log('Initializing map...');
    leafletMap.initialize()
    leafletMap.debugging();
};