/**
 * Coriandoiliii
 */

"use strict";

// Contenitore coriandoli
const confettiContainer = document.getElementById('confetti-container');

// Durata animazione
const animationDuration = 7;//[sec]

// Velocità di creazione coriandoli (più il tempo è basso, più coriandoli cadranno)
const confettiSpawnRate = 50;//[ms]

// Fattore di "lentezza" (più è alto, più lentamente si mouveranno i coriandoli)
const slownessFactor = 2;

// Lista colori!
const confettiColors = [
    '#e74c3c',
    '#3498db',
    '#2ecc71',
    '#f39c12',
    '#9b59b6'
];

// Forme coriandoli!
const confettiShapes = [
    'circle',
    'square',
    'triangle'
];

// Funzione per creare il coriandolo
function createConfetti() {
    // Creazione del coriandolo
    const confetti = document.createElement('div');

    // Viene scelta una forma a caso
    const randomShape = confettiShapes[Math.floor(Math.random() * confettiShapes.length)];
    confetti.className = `confetti ${randomShape}`;

    // Una posizione a random sullo schermo (distanza da sinistra)
    confetti.style.left = `${Math.random() * window.innerWidth}px`;

    // Posizione iniziale in cima alla pagina
    confetti.style.top = "0";

    // Viene scelto un colore a caso da 'confettiColors' generando un indice a caso da prelevare dall'array
    confetti.style.backgroundColor = confettiColors[Math.floor(Math.random() * confettiColors.length)];

    // Imposta una rotazione casuale
    confetti.style.transform = `rotate(${Math.random() * 360}deg)`;

    // Lo appende nella pagina
    confettiContainer.appendChild(confetti);

    // Generazione della velocità
    const speed = Math.random() * 5 + slownessFactor;

    // Calcolo della distanza che il coriandolo compierà prima di essere eliminato
    // (Letteralmente 'grandezza-della-pagina' + 'grandezza-del-coriandolo' * 10)
    const maxDistance = window.innerHeight + (confetti.offsetHeight * 10);

    // Tempo di inizio animazione
    let startTime = null;

    // Esegue un passo dell'animazione
    function step(currentTime) {
        startTime = startTime ? startTime : currentTime;

        // Progresso dell'animazione fra il 'tempo corrente' e il 'tempo d'inizio'
        const progress = currentTime - startTime;

        // Calcola lo spostamento in base al progresso e alla velocità del coriandolo
        const newPosition = Math.min(progress / speed, maxDistance);

        // Calcola la rotazione in base al tempo e alla velocità di rotazione
        const rotation = (currentTime / (speed * 300)) * 360;

        // Applica la trasformazione con rotazione e posizione
        confetti.style.transform = `translateY(${newPosition}px) rotate(${rotation}deg)`;

        // Se il coriandolo non è più in vista, eliminalo
        if (newPosition < maxDistance) {
            // Se lo è, richiedi il prossimo frame...
            window.requestAnimationFrame(step);
        } else {
            // ...altrimenti, elimina il coriandolo
            confettiContainer.removeChild(confetti);
        }
    }

    // Richiesta del prossimo frame
    window.requestAnimationFrame(step);
}

// Fai durare 5 secondi alla durata 
function letThemRain() {
    // Tempo che indica quando deve finire l'animazione
    const endTime = Date.now() + (animationDuration * 1000);
    
    // Controlla se il tempo è stato superato o meno per continuare a creare coriandoli
    const interval = setInterval(() => {
        // Controlliamo se l'animazione debba essere terminata
        if (Date.now() < endTime) {
            // Se non lo è, non è ancora passato abbastanza tempo, creiamo coriandoli...
            createConfetti();
        } else {
            // ...altrimenti, terminiamo l'intervallo
            clearInterval(interval);
        }
    }, confettiSpawnRate);
}