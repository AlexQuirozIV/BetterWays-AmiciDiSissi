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
    document.getElementById('chi-siamo-menu--title').textContent = informations.menuNames[22];

    /* La nostra bellissima presentazione */
    document.getElementById('chi-siamo-menu--presentation').innerHTML = informations.menuNames[23];

    /* Header */
    document.getElementById('chi-siamo-menu--feedback-section--header').textContent = informations.menuNames[24];

    /* Instagram */
    document.querySelector('#chi-siamo-menu--feedback-section--instagram > span').textContent = informations.menuNames[25];

    /* Instagram */
    document.querySelector('#chi-siamo-menu--feedback-section--email > span').textContent = informations.menuNames[26];

    /* Attiva il menu */
    menu.classList.toggle('menu--active');

    /* Update flag */
    openedMenuId = id;
}