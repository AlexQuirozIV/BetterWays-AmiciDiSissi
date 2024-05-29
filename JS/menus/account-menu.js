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
    menu.querySelector('div').textContent = informations.menuNames[1];

    
    /* Nomi pulsanti */
    let buttons = document.getElementsByClassName('accountMenuButtons');

    buttons[0].textContent = informations.menuNames[2];
    buttons[1].textContent = informations.menuNames[3];

    
    /* Attiva il menu */
    menu.classList.toggle('menu--active');

    // Update flag
    openedMenuId = id;
}