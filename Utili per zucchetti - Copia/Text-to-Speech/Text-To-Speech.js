document.addEventListener('DOMContentLoaded', function() {
    var textToSpeak = document.getElementById('textToSpeak').textContent.trim();
    var element = document.getElementById('textToSpeak');
    element.addEventListener('mouseover', function() {
        convertToSpeech(textToSpeak);
    });
    element.addEventListener('mouseout', stopSpeech);
});

function convertToSpeech(text) {
    if ('speechSynthesis' in window) {
        var message = new SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(message);
    } else {
        alert("Spiacente, il tuo browser non supporta la sintesi vocale.");
    }
}

function stopSpeech() {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
    }
}
