/**
 * Single marker menu
*/
"use strict";

function addSingleMarkerMenu() {
    let id = 'single-marker-menu';

    /* Funzioni necessarie gestione menu */
    let menu = document.getElementById(id);
    let shouldThisMenuClose = handleMenuButtonPress(menu);
    if (shouldThisMenuClose == 'yes') { return; }

    /* Titolo */
    menu.querySelector('span').textContent = informations.menuNames[28];

    /* Opzioni per il select */
    let select = menu.querySelector('select');
    let selectedIndex = select.selectedIndex; // Salva l'index, così rimane alla prossima apertura

    // Svuota il select...
    if (select.hasChildNodes()) {
        while (select.firstChild) {
            select.removeChild(select.firstChild);
        }
    }

    // Ottieni i nomi e le chiavi associate
    let optionsData = Object.entries(informations.placesNames).map(([key, value]) => ({
        key: key,
        name: value[1]
    }));

    // ... ordina le opzioni alfabeticamente...
    optionsData.sort((a, b) => a.name.localeCompare(b.name));

    // ... e riempi il select con le "nuove" opzioni ordinate
    optionsData.forEach(optionData => {
        let option = document.createElement('option');
        option.value = optionData.key;
        option.text = optionData.name;
        select.appendChild(option);
    });

    // Ripristina l'index per l'apertura
    if (selectedIndex >= 0 && selectedIndex < select.options.length) {
        select.selectedIndex = selectedIndex;
    }


    /* Pulsanti */
    let buttons = menu.querySelectorAll('div button');

    // Testo e funzione per ciascuno
    buttons[0].textContent = informations.menuNames[29];
    buttons[0].setAttribute('onclick', 'singleMarkerMenuPlace()');

    buttons[1].textContent = informations.menuNames[30];
    buttons[1].setAttribute('onclick', 'singleMarkerMenuRemove()');

    buttons[2].textContent = informations.menuNames[31];
    buttons[2].setAttribute('onclick', 'singleMarkerMenuAddAll()');

    buttons[3].textContent = informations.menuNames[32];
    buttons[3].setAttribute('onclick', 'singleMarkerMenuRemoveAll()');


    /* Attiva il menu */
    menu.classList.toggle('menu--active');

    // Update flag
    openedMenuId = id;
}

//* Funzioni inerenti */

/* Generazione un singolo marker */
function newSingleMarker([latitude, longitude], info) {
    if ([latitude, longitude] == undefined) {
        console.log('Could not place marker, coordinates undefined!');
        return null;
    }

    // Crea marker...
    let marker = L.marker([latitude, longitude], { icon: markerIcon });

    marker.bindPopup(info);
    marker.on('click', closeOpenMenus);
    marker.addTo(map);

    // ... e in output per salvarlo in 'markers' nella funzione 'addSingleMarkerMenu'...
    return marker;
}

/* Metti / togli marker singolo piazzato */
function singleMarkerMenuPlace() {
    var selectedPlace = document.querySelector('#single-marker-menu select').value;

    // Crea il nuovo marker se non già piazzato e lo salva dentro 'markers'
    if (availablePlace.includes(selectedPlace)) {
        // Genera le informazioni da aggiungere al popup con le informazioni da 'informations'
        var bindingInfos = bindPopupInfos(
            informations.placesNames[selectedPlace][1],
            informations.placesNames[selectedPlace][2],
            informations.placesNames[selectedPlace][3],
            informations.placesNames[selectedPlace][4]
        );

        // Piazza il menu e salvalo in 'singleMarkers'
        singleMarkers[selectedPlace] = newSingleMarker(informations.placesNames[selectedPlace][0], bindingInfos);
        // Svuota lo spazio da 'availablePlace'
        availablePlace[availablePlace.indexOf(selectedPlace)] = null;
    }
}

function singleMarkerMenuRemove() {
    var selectedPlace = document.querySelector('#single-marker-menu select').value;

    // Se il marker non è piazzato, lo toglie
    if (!(availablePlace.includes(selectedPlace))) {
        map.removeLayer(singleMarkers[selectedPlace]);

        // Il valore viene ripristinato, invece di 'null'
        availablePlace[availablePlace.indexOf(null)] = selectedPlace;
    }
}

/* Metti / togli TUTTI i marker piazzati */
function singleMarkerMenuAddAll() {
    // Se sono tutti piazzati, esci dalla funzione...
    if (availablePlace.every(element => element === null)) {
        return;
    }

    // ... altrimenti, lo piazza
    for (let i = 0; i < availablePlace.length; i++) {
        let marker = availablePlace[i];

        if (marker === null) {
            continue; // Skippa al prossimo se il corrente è 'null'
        }

        // Genera le informazioni da aggiungere al popup con le informazioni da 'informations'
        var bindingInfos = bindPopupInfos(
            informations.placesNames[marker][1],
            informations.placesNames[marker][2],
            informations.placesNames[marker][3],
            informations.placesNames[marker][4]
        );

        // Piazza il menu e salvalo in 'singleMarkers'
        singleMarkers[marker] = newSingleMarker(informations.placesNames[marker][0], bindingInfos);
        // Svuota lo spazio da 'availablePlace'
        availablePlace[i] = null;
    }
}

function singleMarkerMenuRemoveAll() {
    // Per ogni 'marker' in 'singleMarkers', rimuovi dalla mappa con funzione Leaflet
    for (const marker in singleMarkers) {
        map.removeLayer(singleMarkers[marker]);
    }
    singleMarkers = {};
    // Svuota e riempi 'availablePlace' con i posti (resettati)
    availablePlace = [];
    Object.keys(informations.placesNames).forEach(place => {
        availablePlace.push(place);
    });
}