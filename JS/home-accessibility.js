/**
 * Gestione 
 */

"use strict";

const boldSlider = document.getElementById('boldSlider');
const contrastSlider = document.getElementById('contrastSlider');
const textToSpeechSlider = document.getElementById('textToSpeechSlider');

//! Funzione per mettere il grassetto
const originalFontSizes = [];

function boldTextAction() {
    document.querySelectorAll('*').forEach(element => {
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
const originalFilters = [];

function contrastAction() {
    document.querySelectorAll('*').forEach(element => {
        originalFilters.push({
            element: element,
            originalFilter: element.style.filter
        });
        element.style.filter = 'contrast(103%)';
    });
}
function revertContrastAction() {
    originalFilters.forEach(filter => {
        filter.element.style.filter = filter.originalFilter;
    });
    originalFilters.length = 0;
}


//! Funzione per mettere il text-to-speech
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

//* Funzione per sentire il toggle di 'textToSpeechSlider'
textToSpeechSlider.addEventListener('change', function() {
    if (this.checked) {
        textToSpeechAction();
    } else {
        revertTextToSpeechAction();
    }
});