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
    document.getElementById('single-marker-menu--title').textContent = menuTranslations["single-marker-menu--title"][languageID];

    /* Opzioni per il select */
    let select = menu.querySelector('select');
    let selectedIndex = select.selectedIndex; // Salva l'index, così rimane alla prossima apertura

    // Svuota il select...
    if (select.hasChildNodes()) {
        while (select.firstChild) {
            select.removeChild(select.firstChild);
        }
    }

    // ... ottieni e ordina alfabeticamente i nomi delle opzioni...
    let optionsNames = Object.keys(placesTranslations)
    .map(key => placesTranslations[key]["titles"][languageID]);

    let optionsValues = Object.keys(placesTranslations);

    let combinedOptions = optionsValues.map((value, index) => ({
        value: value,
        name: optionsNames[index]
    }));

    combinedOptions.sort((a, b) => a.name.localeCompare(b.name));

    optionsNames = combinedOptions.map(option => option.name);
    optionsValues = combinedOptions.map(option => option.value);


    // ... e riempi il select con le "nuove" opzioni ordinate
    for (let i = 0; i < optionsNames.length; i++) {
        let option = document.createElement('option');
        option.value = optionsValues[i];
        option.text = optionsNames[i];
        select.appendChild(option);
    }

    // Ripristina l'index per l'apertura
    if (selectedIndex >= 0 && selectedIndex < select.options.length) {
        select.selectedIndex = selectedIndex;
    }


    /* Pulsanti */
    let buttons = menu.querySelectorAll('div button');

    // Testo e funzione per ciascuno
    buttons[0].textContent = menuTranslations["single-marker-menu--add-marker"][languageID];
    buttons[0].setAttribute('onclick', 'singleMarkerMenuPlace()');

    buttons[1].textContent = menuTranslations["single-marker-menu--remove-marker"][languageID];
    buttons[1].setAttribute('onclick', 'singleMarkerMenuRemove()');

    buttons[2].textContent = menuTranslations["single-marker-menu--add-all-markers"][languageID];
    buttons[2].setAttribute('onclick', 'singleMarkerMenuAddAll()');

    buttons[3].textContent = menuTranslations["single-marker-menu--remove-all-markers"][languageID];
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
            placesTranslations[selectedPlace]["titles"][languageID],
            placesTranslations[selectedPlace]["rating"],
            placesTranslations[selectedPlace]["descriptions"][languageID],
            placesTranslations[selectedPlace]["image"]
        );

        // Piazza il menu e salvalo in 'singleMarkers'
        singleMarkers[selectedPlace] = newSingleMarker(placesTranslations[selectedPlace]["coordinates"], bindingInfos);
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
    availablePlace.forEach(place => {
        let marker = availablePlace[availablePlace.indexOf(place)];

        if (marker === null) {
            return; // Skippa al prossimo se il corrente è 'null'
        }

        // Genera le informazioni da aggiungere al popup con le informazioni da 'informations'
        var bindingInfos = bindPopupInfos(
            placesTranslations[place]["titles"][languageID],
            placesTranslations[place]["rating"],
            placesTranslations[place]["descriptions"][languageID],
            placesTranslations[place]["image"]
        );

        // Piazza il menu e salvalo in 'singleMarkers'
        singleMarkers[marker] = newSingleMarker(placesTranslations[place]["coordinates"], bindingInfos);
        // Svuota lo spazio da 'availablePlace'
        availablePlace[availablePlace.indexOf(place)] = null;
    });
}

function singleMarkerMenuRemoveAll() {
    // Per ogni 'marker' in 'singleMarkers', rimuovi dalla mappa con funzione Leaflet
    for (const marker in singleMarkers) {
        map.removeLayer(singleMarkers[marker]);
    }
    singleMarkers = {};
    // Svuota e riempi 'availablePlace' con i posti (resettati)
    availablePlace = [];
    Object.keys(placesTranslations).forEach(place => {
        availablePlace.push(place);
    });
}