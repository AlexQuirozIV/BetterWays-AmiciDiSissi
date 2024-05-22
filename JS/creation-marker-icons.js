/**
 * Marker icon creation
 */

"use strict";

const markerIcon = createMarkerIcon('../img/marker-icone/markerIcona.png');
const markerIconGold = createMarkerIcon('../img/marker-icone/markerIcona-gold.png');
const markerIconGreen = createMarkerIcon('../img/marker-icone/markerIcona-green.png');

function createMarkerIcon(url) {
    return L.icon({
        iconUrl: url,

        iconSize: [48, 48],     // Grandezza icona
        iconAnchor: [35, 60],     // Punto dell'icona che indicherà il punto preciso sulla mappa
        popupAnchor: [-10, -60]    // Punto da dove il popup si apre
    });
}