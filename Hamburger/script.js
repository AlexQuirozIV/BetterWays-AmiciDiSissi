"use strict";

var hamburgerMenu = document.getElementById('hamburgerMenu');

hamburgerMenu.addEventListener('click', function() {
    this.classList.toggle('open');
});