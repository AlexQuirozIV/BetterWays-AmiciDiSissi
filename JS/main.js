/**
 * Animazioni main
 */

"use strict";

// Indici
var currentImageIndexLeft = 1;
var currentImageIndexRight = 1;


document.body.onload = () => {
    changeMapText();
    loadSlidingImages();
    automaticSlide();
    showImageLeft(currentImageIndexLeft);
    showImageRight(currentImageIndexRight);
};


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

//
var images = [];
var informaitons = [];

function loadSlidingImages() {
    // Fetch del JSON
    fetch('../JSON/languageTranslations/italiano.json')
        .then(response => response.json())
        .then(data => {
            images = Object.values(data.placesNames).map(place => place[4]);

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
        })
    .catch(error => console.error('Error fetching JSON:', error));
}