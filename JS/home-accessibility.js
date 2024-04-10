/**
 * Gestione 
 */

"use strict";

const boldSlider = document.getElementById('boldSlider');
const blackAndWhiteSlider = document.getElementById('blackAndWhiteSlider');
const contrastSlider = document.getElementById('contrastSlider');
const textToSpeechSlider = document.getElementById('textToSpeechSlider');

//! Funzione per mettere il grassetto
const originalFontSizes = [];

function boldTextAction() {
    document.querySelectorAll('*:not(html):not(#betterWays_titolo)').forEach(element => {
        originalFontSizes.push({
            element: element,
            originalFontSize: element.style.fontSize
        });
        element.style.fontSize = `calc(${window.getComputedStyle(element).fontSize} + 6%)`;
    });
}
function revertBoldTextAction() {
    originalFontSizes.forEach(fontSize => {
        fontSize.element.style.fontSize = fontSize.originalFontSize;
    });
    originalFontSizes.length = 0;
}

//! Filtri
const originalFilters = [];

// Salva i valori originali
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('*').forEach(element => {
        originalFilters.push({
            element: element,
            originalFilter: element.style.filter
        });
    });
});

//* Funzione per mettere il contrasto colori
function contrastAction() {
    originalFilters.forEach(filter => {
        filter.element.style.filter = 'contrast(103%)';
    });
}


//* Funzione per mettere il bianco e nero
function blackAndWhiteAction() {
    originalFilters.forEach(filter => {
        filter.element.style.filter = 'grayscale(100%)';
    });
}

//* Resettare a default filtri
function revertFilters() {
    originalFilters.forEach(filter => {
        filter.element.style.filter = filter.originalFilter;
    });
}


//TODO Funzione per mettere il text-to-speech
function textToSpeechAction() {
    console.log('Text-to-speech action triggered');
}
function revertTextToSpeechAction() {
    console.log('Reverting text-to-speech action');
}


//* Funzione per sentire il toggle di 'boldSlider'
boldSlider.addEventListener('change', function() {
    if (this.checked) {
        boldTextAction();
    } else {
        revertBoldTextAction();
    }
});

//* Funzione per sentire il toggle di 'contrastSlider'
contrastSlider.addEventListener('change', function() {
    if (this.checked) {
        blackAndWhiteSlider.checked = false;
        contrastAction();
    } else {
        revertFilters();
    }
});

//* Funzione per sentire il toggle di 'blackAndWhiteSlider'
blackAndWhiteSlider.addEventListener('change', function() {
    if (this.checked) {
        contrastSlider.checked = false;
        blackAndWhiteAction();
    } else {
        revertFilters();
    }
});

//* Funzione per sentire il toggle di 'textToSpeechSlider'
textToSpeechSlider.addEventListener('change', function() {
    if (this.checked) {
        textToSpeechAction();
    } else {
        revertTextToSpeechAction();
    }
});