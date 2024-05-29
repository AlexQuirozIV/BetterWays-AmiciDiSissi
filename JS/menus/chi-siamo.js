/**
 * Chi siamo menu
 */

"use strict";

function chiSiamoMenu() {
    let id = 'chi-siamo-menu';

    /* Funzioni necessarie gestione menu */
    let menu = document.getElementById(id);
    let shouldThisMenuClose = handleMenuButtonPress(menu);
    if (shouldThisMenuClose == 'yes') { return; }

    /* Titolo */
    menu.querySelector('div').textContent = informations.menuNames[21];

    /* La nostra bellissima presentazione */
    menu.querySelector('span').innerHTML = informations.menuNames[22];

    /* Feedback */
    document.querySelector('#feedbackSection div').textContent = informations.menuNames[23];

    /* Attiva il menu */
    menu.classList.toggle('menu--active');

    /* Update flag */
    openedMenuId = id;
}