/*
 * News Menu
 */

"use strict";

function newsMenu() {
    let id = 'news-menu';

    /* Funzioni necessarie gestione menu */
    let menu = document.getElementById(id);
    let shouldThisMenuClose = handleMenuButtonPress(menu);
    if (shouldThisMenuClose == 'yes') { return; }

    /* Titolo */
    document.getElementById('news-menu--title').textContent = informations.menuNames[10];
    
    /* Attiva il menu */
    menu.classList.toggle('menu--active');

    /* Update flag */
    openedMenuId = id;
}