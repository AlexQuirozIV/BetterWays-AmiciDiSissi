package betterwayss; // Dichiarazione del package betterwayss che contiene la classe Server

import java.io.FileWriter; // Importa la classe FileWriter dal package java.io per scrivere i caratteri in un file
import java.io.IOException; // Importa la classe IOException dal package java.io per gestire le eccezioni di input/output
import java.io.PrintWriter; // Importa la classe PrintWriter dal package java.io per scrivere i caratteri su un file di testo


public class dati {
    public static void scrivi (String luogo, String latitude, String longitude) throws IOException {        
        //Creazione di un oggetto punto della classe Server
        Server punto = new Server(luogo, latitude, longitude);

        //creazione della stringa da memorizzare nel file testo
        String linea = punto.toString();
        
        //creazione del percorso completo del file
        String desktopPath = System.getProperty("user.home") + "/Desktop/";

        //2.creazione dell'oggetto stream
        //se non esiste lo crea
        FileWriter file = new FileWriter(desktopPath + "Server.txt",true);

        //3.Creazione dell'oggetto del flusso di scrittura
        PrintWriter scrivi = new PrintWriter(file);
        
        //scrittura della linea contenente i dati di interesse
        scrivi.println(luogo + " / " + latitude + " / " + longitude);
        
        //chiusura del file
        scrivi.close();
        
        // Stampa il percorso del file su desktop sulla console di output
        System.out.println("File salvato in: " + desktopPath); 
    }
}