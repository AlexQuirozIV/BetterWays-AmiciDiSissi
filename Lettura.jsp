<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@page import="java.io.*" %>
<%@page import="java.util.*"%>
<%@page import="Gestione.Server"%>

<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>Marker e routing</title>
        
        
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.2.0/dist/leaflet.css" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet-routing-machine@latest/dist/leaflet-routing-machine.css" />
        <script src="https://unpkg.com/leaflet@1.2.0/dist/leaflet.js"></script>
        <script src="https://unpkg.com/leaflet-routing-machine@latest/dist/leaflet-routing-machine.js"></script>
        <!--riferimento ad un css personale-->
        <link rel="stylesheet" href="../css/style.css" type="text/css">
        
    </head>
    <body>
         <div id="map"></div>
           <script>   
        var percorso=[[45.30389319648771, 9.498632761854047]];
        var inizio;
        var fine;
        var popup;
        var mymap, mappa, marker, testo="IIS'A.Volta'", map;
        // Creare una nuova mappa Leaflet
        var map = L.map('map').setView([45.30389319648771, 9.498632761854047], 14);

        // Aggiungere un livello di base alla mappa
         L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
             attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
         }).addTo(map);
        marker = L.marker([45.30389319648771, 9.498632761854047]).addTo(map);
        popup = L.popup().setContent("Partenza: IIS");
         marker.bindPopup(popup).openPopup();
        // marker.bindPopup(testo);
        </script>
        <script>
            //determino il luogo di partenza
           // inizio=L.latLng(45.30408592976634, 9.49930594969152);
        </script>
        <%
        //Dichiaro un oggetto file con l'indicazione del nome del file (Server.txt)
        FileInputStream file = new FileInputStream("Server.txt");
        //Oggetto scanner per leggere una linea
        Scanner lettore=new Scanner(file);
        //conterrà una riga letta da Server.txt
        String linea;
        //oggetto che permette lo split
        StringTokenizer locale;
        //variabili String che memorizzeranno i dati del locle
        String lg="",lt="",nome="", indirizzo="";
        //inizio del ciclo di lettura
         while(lettore.hasNextLine()==true){
             //si legge una linea dal file POI.txt
            linea=lettore.nextLine();
            // inizalizzo l'oggetto locale,in modo che spezzetti i dati,
            //passando al costruttore la linea letta
            // e indicando i caratteri di separazione dei dati
            locale = new StringTokenizer(linea,"%%%");
            //attribuisco i dati alle variabili string
            lt=locale.nextToken();
            lg=locale.nextToken();
            nome=locale.nextToken();
            indirizzo=locale.nextToken();
            //creo il testo del popup
            String tst;
            tst="<b>"+nome+"</b><br>";
            tst+=indirizzo+"<br>";
            //chiudo java
            %>
            <!--apro javascript-->
            <script>
                //passo i dati del Marker e del Popup
                //con Jason
                lat=<%=lt%>;
                long=<%=lg%>;
                testo="<%=tst%>";
                //funzione javascript che mette un marker sulla mappa
                //e collegato al marker un popup
                //MarkerPopup(lat,long,testo);
                marker = L.marker([lat,long]).addTo(map);
              /*  popup = L.popup()
               .setContent(testo);
               marker.bindPopup(popup).openPopup();
               // marker.bindPopup(testo);*/
            </script>
            <!--chiudo javascript-->
            
        <script>
            //creazione del vettore percorso che costituiscono
            //i luoghi da visitare (waypoints del routing)
            percorso.push(L.latLng(lat,long));
        </script>
            <%
                //riapro java per chiudere il while
        }
        //chiudo il file
        file.close();
        %>
        <script>     
            //riapro javascript per disegnare il routing
            //inizio=L.latLng(45.30394584938996,9.4984909083659);
        //  Strada();
        // Creare un nuovo oggetto L.Routing.Control e aggiungerlo alla mappa
        L.Routing.control({
            waypoints: percorso,
            position: 'bottomleft',
            dragrable: 'true'
       }).addTo(map);
       // L.Routing.hidden():
        </script>
    </body>
</html>
