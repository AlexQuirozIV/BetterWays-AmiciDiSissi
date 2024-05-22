/**
 * Just for debugging
*/
"use strict";

let clicksLog = [];
function coordinatesOnClick() {
    // Click e output coordinate in console
    map.on('click', (e) => {
        console.log('[' + e.latlng.lat.toFixed(6) + ', ' + e.latlng.lng.toFixed(6) + ']');

        clicksLog.push([e.latlng.lat.toFixed(6), e.latlng.lng.toFixed(6)])
    });
}

function markerFromConsole([latitude, longitude]) {
    let coords = [latitude, longitude];
    let output = "[" + coords[0] + ", " + coords[1] + "]";
    L.marker(coords).addTo(map).bindPopup(output).openPopup();
}

// Passare un array di array [long., lati.]
function routeFromConsole(coords) {
    coords = orderCoordinates(coords);

    L.Routing.control({
        waypoints: coords,

        draggableWaypoints: false,
        addWaypoints: false,

        createMarker: () => { null; }
    }).addTo(map);
}