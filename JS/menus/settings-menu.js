/**
 * Settings menu
 */

"use strict";

//* Costanti inerenti */
const languagesList = [ // Lista lingue supportate
    "🇮🇹 - Italiano",
    "🇬🇧 - English",
    "🇫🇷 - Français",
    "🇪🇸 - Español",
    "🇩🇪 - Deutsch",
    "🇵🇹 - Português"
];
const languagesListID = [
    'it',
    'en',
    'fr',
    'es',
    'de',
    'pt-BR'
];


function settingsMenu() {
    let id = 'settings-menu';


    /* Funzioni necessarie gestione menu */
    let menu = document.getElementById(id);
    let shouldThisMenuClose = handleMenuButtonPress(menu);
    if (shouldThisMenuClose == 'yes') { return; }


    /* Titolo */
    document.getElementById('settings-menu--title').textContent = informations.menuNames[16];


    /* Legenda */
    document.getElementById('settings-menu--legend--header').textContent = informations.menuNames[17];

    let legendContentTexts = document.getElementsByClassName('legend--content--sections--nametags');
    for (let i = 0; i < legendContentTexts.length; i++) {
        let legendContentText = legendContentTexts[i];
        legendContentText.textContent = informations.menuNames[i + 18];
    }

    // Sezione 'cambia lingua'
    let languageSwitch = document.getElementById('settings-menu--language-selection');
    document.getElementById('settings-menu--language-selection--header').textContent = informations.menuNames[21];

    /* Opzioni per il select (lista delle lingue da 'languagesList') */
    let select = languageSwitch.querySelector('select');

    for (let i = 0; i < languagesList.length; i++) {
        let isOptionPresent = false;

        for (let option of select.options) {
            if (option.value === languagesList[i] || option.text === languagesList[i]) {
                isOptionPresent = true;
                break;
            }
        }

        // Se non c'è aggiungila
        if (!isOptionPresent) {
            let option = document.createElement('option');
            option.value = languagesListID[i];
            option.text = languagesList[i];
            select.appendChild(option);
        }
    }

    // Trova l'elemento 'option' con il 'value' uguale a 'localStorage.getItem('currentLanguageID')'
    // e lo mette come selezionato
    Array.from(select.options).find(
        option => option.value === localStorage.getItem('currentLanguageID')
    ).selected = true;


    /* Attiva il menu */
    menu.classList.toggle('menu--active');

    // Controlla cambiamento lingua
    languageChangeListener();

    // Update flag
    openedMenuId = id;
}

//* Funzioni inerenti */
/* Sente quando viene cambiata la lingua e chiama 'handleLanguageChange' per cambiarla */
function languageChangeListener() {
    // Rimuove il listener precedente (altrimenti rifarà il fetch esponenzialmente)
    document.querySelector('#settings-menu--language-selection select').removeEventListener('change', handleLanguageChange);

    // Aggiungine uno nuovo
    document.querySelector('#settings-menu--language-selection select').addEventListener('change', handleLanguageChange);
}

/* Gestisce il cambiamento della lingua */
function handleLanguageChange(event) {
    // Chiudi tutto per aggiornare la lingua
    singleMarkerMenuRemoveAll();
    removeLaidPackage();

    // Prendi le nuove informazioni (dato che ora abbiamo aggiornato 'currentLanguage' e 'currentLanguageID')
    fetchInfos(event.target.value);

    // Resetta il menu delle impostazioni
    resetSettingsMenu();
}

/* Reset del menu dopo aver cambiato lingua */
function resetSettingsMenu() {
    closeOpenMenus();
    setTimeout(() => {
        settingsMenu();
    }, 300);
}