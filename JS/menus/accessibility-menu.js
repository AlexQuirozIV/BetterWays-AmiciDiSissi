/**
 * Accessibility menu
 */

"use strict";

function accessibilityMenu() {
    let id = 'accessibility-menu';


    /* Funzioni necessarie gestione menu */
    let menu = document.getElementById(id);
    let shouldThisMenuClose = handleMenuButtonPress(menu);
    if (shouldThisMenuClose == 'yes') { return; }


    /* Titolo */
    document.getElementById("accessibility-menu--title").textContent = menuTranslations["accessibility-menu--title"][languageID];


    /* Opzioni */
    let options = document.getElementsByClassName('accessibility-menu--option-boxes--nametags');

    options[0].textContent = menuTranslations["accessibility-menu--option-boxes--font-size"][languageID];
    options[1].textContent = menuTranslations["accessibility-menu--option-boxes--color-contrast"][languageID];
    options[2].textContent = menuTranslations["accessibility-menu--option-boxes--black-and-white"][languageID];
    options[3].textContent = menuTranslations["accessibility-menu--option-boxes--text-to-speech"][languageID];

    
    /* Attiva il menu */
    menu.classList.toggle('menu--active');

    // Update flag
    openedMenuId = id;
}