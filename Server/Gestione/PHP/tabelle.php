<!DOCTYPE html>
<html>
    <head>
        <title>Gestione Luoghi e Utenti</title>
    </head>
    <body>
        <?php
        session_start();
        $conn = pg_connect("host=lab.matthew5pl.net port=5432 dbname=test_bw user=postgres password=dbprova");

        if (!$conn) {
            echo 'Connessione al database fallita.';
            exit();
        } else {
            // LOCATIONS
            $query = "SELECT * FROM Locations";
            $result = mysqli_query($conn, $query);

            if (!$result) {
                echo "Errore.<br/>";
                echo mysqli_error($conn);
                exit();
            } else {
                echo '<table id="tabellaLocations" class="table table-bordered caption-top">';
                echo '<caption class="text-center">Luoghi</caption>';
                echo '<thead class="table-light">';
                    echo '<tr>';
                        echo '<th scope="col">ID</th>';
                        echo '<th scope="col">Nome</th>';
                        echo '<th scope="col">Latitudine</th>';
                        echo '<th scope="col">Longitudine</th>';
                    echo '</tr>';
                echo '</thead>';  
                echo '<tbody>';  
                while ($row = mysqli_fetch_array($result)) {
                    echo '<tr>';
                    echo '<td>'.$row['id'].'</td>';
                    echo '<td>'.$row['name'].'</td>';
                    echo '<td>'.$row['latitude'].'</td>';
                    echo '<td>'.$row['longitude'].'</td>';
                    echo '</tr>';
                }
                echo '</tbody>';  
                echo '</table>';
            }

            // USER
            $query = "SELECT * FROM User";
            $result = mysqli_query($conn, $query);

            if (!$result) {
                echo "Errore.<br/>";
                echo mysqli_error($conn);
                exit();
            } else {
                echo '<table id="tabellaUser" class="table table-bordered caption-top">';
                echo '<caption class="text-center">Utenti</caption>';
                echo '<thead class="table-light">';
                    echo '<tr>';
                        echo '<th scope="col">ID</th>';
                        echo '<th scope="col">Nome</th>';
                        echo '<th scope="col">Cognome</th>';
                        echo '<th scope="col">Email</th>';
                        echo '<th scope="col">Password</th>';
                    echo '</tr>';
                echo '</thead>';  
                echo '<tbody>';  
                while ($row = mysqli_fetch_array($result)) {
                    echo '<tr>';
                    echo '<td>'.$row['id'].'</td>';
                    echo '<td>'.$row['nome'].'</td>';
                    echo '<td>'.$row['cognome'].'</td>';
                    echo '<td>'.$row['email'].'</td>';
                    echo '<td>'.$row['password'].'</td>';
                    echo '</tr>';
                }
                echo '</tbody>';  
                echo '</table>';
            }
        }
        ?>
        <script src="BetterWays-AmiciDiSissi/JS/menus/account-menu.js"></script>
    </body>
</html>