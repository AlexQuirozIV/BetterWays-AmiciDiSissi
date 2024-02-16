"use strict";

/* Funzioni per mappa */
let leafletMap = {
    initialize: function() {
                    const map = L.map('map', {zoomControl: false}).setView([45.312881, 9.497850], 14);
                    
                    const bounds = [
                        [45.328609, 9.47382],
                        [45.289614, 9.52866]
                    ];

                    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                        minZoom: 14,
                        maxZoom: 18,
                        attribution: '&copy; <a href = "https://www.openstreetmap.org/copyright">'
                    }).addTo(map);

                    // Imposta limiti
                    map.setMaxBounds(bounds);

                    // Controlli zoom pulsanti
                    L.control.zoom({
                        position: 'bottomleft'
                    }).addTo(map);

                    // Prendi coordinate onClick (in console)
/* Debugging */     map.on('click', onMapClick);

                    function onMapClick(e) {
                        console.log("Coordinates: " + e.latlng);
                    }
                }

    // Funzioni extra da aggiungere qui (dopo inizializzazione)
};

document.body.onload = () => {
    console.log("Initializing map...");
    leafletMap.initialize();
};