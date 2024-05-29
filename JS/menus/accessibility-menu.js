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
    document.getElementById("accessibility-menu--title").textContent = informations.menuNames[11];


    /* Opzioni */
    let options = document.getElementsByClassName('accessibility-menu--option-boxes--nametags');

    options[0].textContent = informations.menuNames[12];
    options[1].textContent = informations.menuNames[13];
    options[2].textContent = informations.menuNames[14];
    options[3].textContent = informations.menuNames[15];

    
    /* Attiva il menu */
    menu.classList.toggle('menu--active');

    // Update flag
    openedMenuId = id;
}