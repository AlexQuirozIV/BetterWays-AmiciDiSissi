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


//! Funzione per mettere il contrasto colori
const originalFilters_Contrast = [];

function contrastAction() {
    document.querySelectorAll('*').forEach(element => {
        originalFilters_Contrast.push({
            element: element,
            originalFilter: element.style.filter
        });
        element.style.filter = 'contrast(103%)';
    });
}
function revertContrastAction() {
    originalFilters_Contrast.forEach(filter => {
        filter.element.style.filter = filter.originalFilter;
    });
    originalFilters_Contrast.length = 0;
}


//! Funzione per mettere il bianco e nero
const originalFilters_BlackAndWhite = [];

function blackAndWhiteAction() {
    document.querySelectorAll('*').forEach(element => {
        originalFilters_BlackAndWhite.push({
            element: element,
            originalFilter: element.style.filter
        });
        element.style.filter = 'grayscale(100%)';
    });
}
function revertBlackAndWhiteAction() {
    originalFilters_BlackAndWhite.forEach(filter => {
        filter.element.style.filter = filter.originalFilter;
    });
    originalFilters_BlackAndWhite.length = 0;
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
        contrastAction();
    } else {
        revertContrastAction();
    }
});

//* Funzione per sentire il toggle di 'blackAndWhiteSlider'
blackAndWhiteSlider.addEventListener('change', function() {
    if (this.checked) {
        blackAndWhiteAction();
    } else {
        revertBlackAndWhiteAction();
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