let JSPBridge = {                                  // Definizione dell'oggetto JSPBridge
    call: function(className, srcFunc, srcArgs) { // Definizione del metodo call di JSPBridge con tre parametri: className, srcFunc, srcArgs
        let formData = new FormData();           // Crea un nuovo oggetto FormData per gestire i dati del modulo HTML

        // Aggiunge i parametri al FormData
        formData.append("class", className); // Aggiunge il parametro "class" con il valore di className
        formData.append("func", srcFunc);   // Aggiunge il parametro "func" con il valore di srcFunc
        formData.append("args", srcArgs);  // Aggiunge il parametro "args" con il valore di srcArgs

        let urlData = new URLSearchParams(); // Crea un nuovo oggetto URLSearchParams per gestire i parametri dell'URL

        // Aggiunge i parametri al URLSearchParams
        for(const pair of formData) {          // Ciclo attraverso ogni coppia chiave-valore in formData
            urlData.append(pair[0], pair[1]); // Aggiunge la coppia chiave-valore al URLSearchParams
        }

        fetch("Server/call.jsp", {      // Esegue una richiesta HTTP POST a "Server/call.jsp"
            method: "post",            // Utilizza il metodo POST
            body: urlData             // Utilizza urlData come corpo della richiesta
        })
        .then((response) => response.text()); // Restituisce il testo della risposta della richiesta
    }
};