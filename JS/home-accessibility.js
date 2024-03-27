/**
 * Gestione 
 */

"use strict";

const boldSlider = document.getElementById('boldSlider');
const contrastSlider = document.getElementById('contrastSlider');
const textToSpeechSlider = document.getElementById('textToSpeechSlider');

//! Funzione per mettere il grassetto
const originalFontWeights = [];

function boldTextAction() {
    document.querySelectorAll('*').forEach(element => {
        originalFontWeights.push({
            element: element,
            originalFontWeight: element.style.fontWeight
        });
        element.style.fontWeight = 'bold';
    });
}
function revertBoldTextAction() {
    originalFontWeights.forEach(fontWeight => {
        fontWeight.element.style.fontWeight = fontWeight.originalFontWeight;
    });
    originalFontWeights.length = 0;
}


//! Funzione per mettere il contrasto colori
function contrastAction() {
    console.log('Contrast action triggered');
}
function revertContrastAction() {
    console.log('Reverting contrast action');
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