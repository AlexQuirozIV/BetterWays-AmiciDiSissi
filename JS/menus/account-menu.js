/**
 * Account menu
 */

"use strict";

function accountMenu() {
    let id = 'account-menu';

    
    /* Funzioni necessarie gestione menu */
    let menu = document.getElementById(id);
    let shouldThisMenuClose = handleMenuButtonPress(menu);
    if (shouldThisMenuClose == 'yes') { return; }

    /* Titolo */
    document.getElementById('account-menu--title').textContent = informations.menuNames[1];

    /* Nomi pulsanti */
    let buttons = menu.getElementsByClassName('function-buttons-section--buttons');

    buttons[0].textContent = informations.menuNames[2];
    buttons[1].textContent = informations.menuNames[3];

    /* Attiva il menu */
    menu.classList.toggle('menu--active');

    // Update flag
    openedMenuId = id;
}