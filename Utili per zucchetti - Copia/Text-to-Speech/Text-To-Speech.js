document.addEventListener('DOMContentLoaded', function() {
    var textElements = document.querySelectorAll('.textToSpeak');
    var toggleSwitch = document.getElementById('toggleSwitch');
    
    toggleSwitch.addEventListener('change', function() {
        if (!toggleSwitch.checked) {
            stopSpeech();
        }
    });

    textElements.forEach(function(element) {
        element.addEventListener('mouseover', function() {
            if (toggleSwitch.checked) {
                convertToSpeech(element.textContent.trim());
            }
        });
        element.addEventListener('mouseout', stopSpeech);
    });
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
