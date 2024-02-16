"use strict";

/* Map functions */
let leafletMap = {
    initialize: function() {
                    var map = L.map('map', {zoomControl: false}).setView([0, 0], 13);
                    
                    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',
                    {
                        maxZoom: 19,
                        attribution: '&copy; <a href = "https://www.openstreetmap.org/copyright">'
                    }).addTo(map);

                    L.control.zoom({
                        position: 'bottomleft'
                    }).addTo(map);
                }

    // Extra settings
};

Helpers.onload(function() {
    console.log("Inizializing map...");
    leafletMap.initialize();
});