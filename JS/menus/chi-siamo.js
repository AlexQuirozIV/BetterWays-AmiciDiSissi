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
    document.getElementById('chi-siamo-menu--title').textContent = menuTranslations["chi-siamo-menu--title"][languageID];

    /* La nostra bellissima presentazione */
    document.getElementById('chi-siamo-menu--presentation').innerHTML = menuTranslations["chi-siamo-menu--presentation"][languageID];

    /* Header */
    document.getElementById('chi-siamo-menu--feedback-section--header').textContent = menuTranslations["chi-siamo-menu--feedback-section--header"][languageID];

    /* Instagram */
    document.querySelector('#chi-siamo-menu--feedback-section--instagram > span').textContent = menuTranslations["chi-siamo-menu--feedback-section--instagram"][languageID];

    /* Instagram */
    document.querySelector('#chi-siamo-menu--feedback-section--email > span').textContent = menuTranslations["chi-siamo-menu--feedback-section--email"][languageID];

    /* Attiva il menu */
    menu.classList.toggle('menu--active');

    /* Update flag */
    openedMenuId = id;
}