"use strict";

var menuTranslations;
var placesTranslations;
var itinerariesTranslations;

              // Controlla se 'currentLanguageID' non sia vuoto (o inesistente), altrimenti imposta 'it' come default.
let languageID = localStorage.getItem('currentLanguageID') ? localStorage.getItem('currentLanguageID') : localStorage.setItem('currentLanguageID', 'it');

async function fetchTranslations() {
    async function getResponse(url) {
        let response = await fetch(url);
        return await response.json();
    }

    placesTranslations = await getResponse('../JSON/places-translations.json');
    menuTranslations = await getResponse('../JSON/menus-translations.json');
    itinerariesTranslations = await getResponse('../JSON/itineraries-translations.json');

    console.log("Successfully fetched the JSONs!");
}

/* Attendiamo di aver preso i dati prima di procedere all'avvio della pagina... */
async function startWebsite() {
    await fetchTranslations();

    initializeMap();
    map.on('click', () => {
        closeOpenMenus();
        __shouldNavbarExpand__ = false;
        toggleExpandedNavbar();
    });
    
    // Aggiungi polylinea alla mappa la Via Francigena (no, non fa niente, è solo lì)
    L.polyline(viaFrancigenaCoords, {
        color: 'red',
        weight: 5,
        opacity: 0.7,
        smoothFactor: 1
    }).addTo(map);

    availablePlaceLanguageRefill();
    setButtonTooltips()

    //TODO: Rimuovere questo quando non servirà più (cancellare "DEBUGGING.js")
    console__coordinatesOnClick();
}

startWebsite();