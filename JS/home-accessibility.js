/**
 * Gestione 
 */

"use strict";

const contrastSlider = document.getElementById('accessibility-menu--switches--contrast');
const blackAndWhiteSlider = document.getElementById('accessibility-menu--switches--black-and-white');
const textToSpeechSlider = document.getElementById('accessibility-menu--switches--text-to-speech');

//! Funzione per mettere il grassetto
const originalFontSizes = new Map();

function adjustFontSize(percentage) {
    document.querySelectorAll('.text-to-speak:not(#title)').forEach(element => {
        if (!originalFontSizes.has(element)) {
            originalFontSizes.set(element, window.getComputedStyle(element).fontSize);
        }
        const originalFontSize = originalFontSizes.get(element);
        const newFontSize = parseFloat(originalFontSize) * (percentage / 100);
        element.style.fontSize = `${newFontSize}px`;
    });
}

function resetFontSize() {
    document.querySelectorAll('*:not(html):not(#title)').forEach(element => {
        if (originalFontSizes.has(element)) {
            element.style.fontSize = originalFontSizes.get(element);
        }
    });
    originalFontSizes.clear();
    slider.value = 100;
    sliderValue.textContent = "100%";
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
        filter.element.style.filter = 'grayscale(100%) contrast(103%)';
    });
}

//* Resettare a default filtri
function revertFilters() {
    originalFilters.forEach(filter => {
        filter.element.style.filter = filter.originalFilter;
    });
}

//! Funzione per mettere il TTS

// Flag to track if speech synthesis has been initiated for the current hover event
var __isSpeechInitiated__ = false;

//* Aggiunge il text-to-speech
function addTextToSpeechListeners() {
    var textElements = document.querySelectorAll('.text-to-speak');
    textElements.forEach(function(element) {
        element.addEventListener('mouseover', function() {
            if (textToSpeechSlider.checked && !__isSpeechInitiated__) {
                convertToSpeech(element.textContent.trim());
                __isSpeechInitiated__ = true;
            }
        });
        element.addEventListener('mouseout', function() {
            stopSpeech();
            __isSpeechInitiated__ = false;
        });
    });
}
// Setup...
addTextToSpeechListeners();

//* 'MutationObserver' controlla se qualche elemento cambia e lo abilita per la lettura
var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        if (mutation.type === 'childList') {
            // Filtra per trovare elementi con testo visibile
            var addedNodes = Array.from(mutation.addedNodes).filter(node => {
                return node.nodeType === 1 && hasVisibleText(node);
            });

            // Aggiunge 'text-to-speak' agli elementi con testo visibile E classe 'leaflet-routing-alt'
            addedNodes.forEach(function(node) {
                if (node.classList.contains('leaflet-routing-alt')) {
                    addClassToElementAndChildren(node, 'text-to-speak');
                }
            });

            // Reinizializza listeners
            addTextToSpeechListeners();
        }
    });
});
//* Funzioni Widget itinerari
// Trovare la classe...
function addClassToElementAndChildren(element, className) {
    if (element.classList) {
        element.classList.add(className);
    }
    var childElements = element.children;
    for (var i = 0; i < childElements.length; i++) {
        addClassToElementAndChildren(childElements[i], className);
    }
}
// ...controllare se ha il testo
function hasVisibleText(element) {
    return element.textContent.trim() !== '';
}

//* Conversione in TTS
function convertToSpeech(text) {
    if ('speechSynthesis' in window) {
        // Dividi in paragrafi (ogni '. ')
        var paragraphs = text.split('. ');

        // Leggi ogni paragrafo
        paragraphs.forEach(function(paragraph) {
            var message = new SpeechSynthesisUtterance(paragraph);
            message.lang = localStorage.getItem('currentLanguageID');
            message.rate = 0.9;
            window.speechSynthesis.speak(message);
        });
    } else {
        alert("Spiacente, il tuo browser non supporta la sintesi vocale.");
    }
}

//* Per fermarlo...
function stopSpeech() {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
    }
}


//! Listeners per i toggles
//* Funzione per sentire il toggle di 'boldSlider'
const slider = document.getElementById('accessibility-menu--slider');
const sliderValue = document.getElementById('accessibility-menu--slider--value');
const resetButton = document.getElementById('accessibility-menu--slider--reset-button');

slider.addEventListener('input', (event) => {
    sliderValue.textContent = `${event.target.value}%`;
});

slider.addEventListener('change', (event) => {
    adjustFontSize(event.target.value);
});

resetButton.addEventListener('click', () => {
    resetFontSize();
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
    if (!textToSpeechSlider.checked) {
        stopSpeech();
    }
});
// Osserva per qualunque cambiamento...
observer.observe(document.body, {
    childList: true,
    subtree: true
});