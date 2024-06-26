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
    document.getElementById('account-menu--title').textContent = menuTranslations["account-menu--title"][languageID];

    /* Nomi pulsanti */
    let button = document.getElementById('account-menu--function-buttons-section--login-button');

    button.textContent = menuTranslations["account-menu--login-button"][languageID];

    /* Attiva il menu */
    menu.classList.toggle('menu--active');

    // Update flag
    openedMenuId = id;
}

/* Apri finestra accesso google */
function handleGoogleAuth() {
    console.log('Google Auth button clicked');
    window.open('https://accounts.google.com/o/oauth2/auth', 'google-auth-popup', 'width=600,height=700');
}