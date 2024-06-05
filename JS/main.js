/*
 * Animazioni main
 */

"use strict";

// Indici
var currentImageIndexLeft = 1;
var currentImageIndexRight = 1;

// Variabili globali per le immagini
var images = [];
var informaitons = [];
var automaticCycleDelay = 4000; // ms

// Inizializzazione
async function loadSlidingImages() {
    // Fetch del JSON
    fetch('../JSON/languageTranslations/italiano.json')
        .then(response => response.json())  // Trasforma risposta da JSON a JS
        .then(data => {
            images = Object.values(data.placesNames).map(place => place[4]);

            applyImages();
            changeMapText();
            automaticSlide();
            showImageLeft(currentImageIndexLeft);
            showImageRight(currentImageIndexRight);
        })
    .catch(error => console.error('Error fetching JSON:', error));
}
document.body.onload = () => {
    loadSlidingImages();
}

/* Immagini a sinistra */
function slideLeft(direction) {
    showImageLeft(currentImageIndexLeft += direction);
    automaticCycleDelay = 4000;
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
    automaticCycleDelay = 4000;
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

// Loop ogni 4 secondi
function automaticSlide() {
    setInterval(function() {
        slideLeft(+1);
        slideRight(+1);
    }, automaticCycleDelay);
}


// Testo 'mappa'
function changeMapText() {
    let language = localStorage.getItem('currentLanguageID');
    let mappa = document.querySelector('#mappaLink span');

    switch (language) {
        case 'en':
            mappa.innerHTML = 'Map';
            break;
        
        case 'es':
            mappa.innerHTML = 'Mapa';
            break;
        
        case 'de':
            mappa.innerHTML = 'Karte';
            break;

        
        case 'fr':
            mappa.innerHTML = 'Carte';
            break;

        
        case 'pt-BR':
            mappa.innerHTML = 'Mapa';
            break;

        default:
            mappa.innerHTML = 'Mappa';
            break;
    }

    console.log(localStorage);
}

// Aggiungi all'HTML
function applyImages() {
    let slidingImages1 = document.getElementById('slidingImages1');
    let slidingImages2 = document.getElementById('slidingImages2');

    for (let i = 0; i < (images.length / 2); i++) {
        let image = document.createElement('img');

        image.classList.add('slidingImageLeft');
        image.setAttribute('src', images[i]);

        slidingImages1.appendChild(image);
    }

    for (let i = (images.length / 2); i < images.length; i++) {
        let image = document.createElement('img');

        image.classList.add('slidingImageRight');
        image.setAttribute('src', images[i]);

        slidingImages2.appendChild(image);
    }
}