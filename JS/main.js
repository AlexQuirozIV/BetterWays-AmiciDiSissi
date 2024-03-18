/**
 * Animazioni main
 */

"use strict";

// Indici
var currentImageIndexLeft = 1;
var currentImageIndexRight = 1;

// Inizializza...
automaticSlide();
showImageLeft(currentImageIndexLeft);
showImageRight(currentImageIndexRight);


/* Immagini a sinistra */
function slideLeft(direction) {
    showImageLeft(currentImageIndexLeft += direction);
}

function showImageLeft(index) {
    let images = document.getElementsByClassName("slidingImageLeft");

    if(index > images.length) {
        currentImageIndexLeft = 1;
    }
    if(index < 1) {
        currentImageIndexLeft = images.length;
    }

    for(let i = 0; i < images.length; i++) {
        images[i].style.display = 'none';
    }

    images[currentImageIndexLeft - 1].style.display = 'block';
}


/* Immagini a destra */
function slideRight(direction) {
    showImageRight(currentImageIndexRight += direction);
}

function showImageRight(index) {
    let images = document.getElementsByClassName("slidingImageRight");

    if(index > images.length) {
        currentImageIndexRight = 1;
    }
    if(index < 1) {
        currentImageIndexRight = images.length;
    }

    for(let i = 0; i < images.length; i++) {
        images[i].style.display = 'none';
    }

    images[currentImageIndexRight - 1].style.display = 'block';
}

// Loop ogni 5 secondi
function automaticSlide() {
    setInterval(function() {
        slideLeft(+1);
        slideRight(+1);
    }, 4000);
}