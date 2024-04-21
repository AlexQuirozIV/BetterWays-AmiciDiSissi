package betterwayss; // Dichiarazione del package betterwayss che contiene la classe Server

import java.io.IOException;         // Importa la classe IOException dal package java.io per gestire le eccezioni di input/output
import java.util.logging.Level;    // Importa la classe Level dal package java.util.logging per livelli di log
import java.util.logging.Logger;  // Importa la classe Logger dal package java.util.logging per la registrazione dei log

public class Server {             // Dichiarazione della classe Server
    static String luogo;         // Dichiarazione della variabile statica luogo di tipo String
    static String latitude;     // Dichiarazione della variabile statica latitude di tipo String
    static String longitude;   // Dichiarazione della variabile statica longitude di tipo String

    public Server(String luogo, String latitude, String longitude) {    // Definizione del costruttore della classe Server
        this.luogo = luogo;                                            // Inizializzazione della variabile luogo con il valore passato come parametro
        this.latitude = latitude;                                     // Inizializzazione della variabile latitude con il valore passato come parametro
        this.longitude = longitude;                                  // Inizializzazione della variabile longitude con il valore passato come parametro
    }
   
    public static String convert(Object obj) {                      // Definizione del metodo convert che prende un oggetto come argomento e restituisce una stringa
        String parametri = (String)obj;                            // Converte l'oggetto in una stringa
        
        String[] split = parametri.split(",");                    // Suddivide la stringa in sottostringhe utilizzando la virgola come separatore e le memorizza in un array
        luogo = split[2];                                        // Assegna il terzo elemento dell'array (indice 2) alla variabile luogo
        latitude = split[0];                                    // Assegna il primo elemento dell'array (indice 0) alla variabile latitude
        longitude = split[1];                                  // Assegna il secondo elemento dell'array (indice 1) alla variabile longitude
        
        try {
            dati.scrivi(luogo, latitude, longitude);                                // Chiama il metodo scrivi della classe dati per scrivere i dati su un file
        } catch (IOException ex) {                                                 // Gestisce l'eccezione di input/output
            Logger.getLogger(Server.class.getName()).log(Level.SEVERE, null, ex); // Registra l'eccezione nel logger con il livello di gravità SEVERE
        }
        
        return luogo  + " / " + latitude + " / " + longitude + " / ";           // Restituisce una stringa contenente luogo, latitude e longitude
    }
}