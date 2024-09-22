/**
 * Just for debugging
*/
"use strict";

let console__clicksLog = [];
let console__markers = {};
var console__route;
function console__coordinatesOnClick() {
    // Click e output coordinate in console
    map.on('click', (e) => {
        console.log('[' + e.latlng.lat.toFixed(6) + ', ' + e.latlng.lng.toFixed(6) + ']');

        console__logCoordinates([e.latlng.lat.toFixed(6), e.latlng.lng.toFixed(6)]);
    });
}

function console__logCoordinates([a, b]) {
    console__clicksLog.push([a, b])
}

function console__emptyLog(from, to) {
    if (from === undefined && to === undefined) {
        console__clicksLog = [];
    }

    from = from === undefined ? 0 : from; from--;
    to = to === undefined ? console__clicksLog.length : to; to = to - from;

    console__clicksLog.splice(from, to);
}

function console__createMarker([latitude, longitude]) {
    let coords = [latitude, longitude];
    let output = "[" + coords[0] + ", " + coords[1] + "]";
    return L.marker(coords).addTo(map).bindPopup(output).openPopup();
}

// Passare un array di array [long., lati.] (solitamente "console__ClicksLog")
function console__createRoute(coords) {
    try {
        console__removeMarkersAndRoute();
    } catch (e) {
        console.log();
    }

    coords = orderCoordinates(coords);

    console__route = L.Routing.control({
        waypoints: coords,

        draggableWaypoints: false,
        addWaypoints: false,

        createMarker: (_i) => {
            console__markers[_i] = console__createMarker([coords[_i][0], coords[_i][1]]);
        }
    }).addTo(map);
}

function console__removeMarkersAndRoute() {
    try {
        map.removeControl(console__route);
    } catch (e) {
        /* Nothing to do */
    }

    for (const marker in console__markers) {
        map.removeLayer(console__markers[marker]);
    }
}