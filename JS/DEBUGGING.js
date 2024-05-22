/**
 * Just for debugging
*/
"use strict";

function coordinatesOnClick() {
    // Click e output coordinate in console
    map.on('click', (e) => {
        console.log('[' + e.latlng.lat.toFixed(6) + ', ' + e.latlng.lng.toFixed(6) + ']');
    });
}

function markerFromConsole([latitude, longitude]) {
    let coords = [latitude, longitude];
    let output = "[" + coords[0] + ", " + coords[1] + "]";
    L.marker(coords).addTo(map).bindPopup(output);
}