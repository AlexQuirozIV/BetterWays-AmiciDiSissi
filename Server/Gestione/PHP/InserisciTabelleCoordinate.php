<!DOCTYPE html>
<html>
    <head>
        <title>Gestione Location</title>
    </head>
    <body>
    <!--
        <nav class="navbar navbar-expand-sm navbar-light bg-light">
            <a class="navbar-brand" href="mainPage.php">GestioneLocation</a>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav">
                    <li class="nav-item">
                        <a class="nav-link" href="../../mainPage.php">Home</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="../../tabelle.php">Tabelle</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link active" href="../../inserimenti.php">Inserimenti</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="../../viste.php">Visualizzazioni</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="../../query.php">Interrogazioni</a>
                    </li>
                </ul>
            </div>
        </nav>
    -->
        <?php
        session_start();
        $conn = pg_connect("host=lab.matthew5pl.net port=5432 dbname=test_bw user=postgres password=dbprova");

        if (!$conn) {
            echo 'Connessione al database fallita.';
            exit();
        } else {
            $name = isset($_POST['name']) ? $_POST['name'] : NULL;
            $latitude = isset($_POST['latitude']) ? $_POST['latitude'] : NULL;
            $longitude = isset($_POST['longitude']) ? $_POST['longitude'] : NULL;

            $query = "INSERT INTO locations (name, latitude, longitude)
                    VALUES ('$name', '$latitude', '$longitude')";

            $result = pg_query($conn, $query);
            if ($result) {
                echo("<br>Location inserita correttamente!<br><br>");
            } else {
                echo("<br>Location NON inserita correttamente.<br><br>");
            }

            echo '<h3>Tabella Completa</h3>';
            $query = "SELECT * FROM locations";

            $result = pg_query($conn, $query);

            if (!$result) {
                echo "Errore.<br/>";
                echo pg_last_error($conn);
                exit();
            } else {
                echo '<table id="tabellaLocations" class="table table-bordered caption-top">';
                echo '<caption class="text-center">Locations</caption>';
                echo '<thead class="table-light">';
                    echo '<tr>';
                        echo '<th scope="col">Nome</th>';
                        echo '<th scope="col">Latitudine</th>';
                        echo '<th scope="col">Longitudine</th>';
                    echo '</tr>';
                echo '</thead>';
                echo '<tbody>';
                while ($row = pg_fetch_array($result)) {
                    echo '<tr>';
                    echo '<td>' . $row['name'] . '</td>';
                    echo '<td>' . $row['latitude'] . '</td>';
                    echo '<td>' . $row['longitude'] . '</td>';
                    echo '</tr>';
                }
                echo '</tbody>';
                echo '</table>';
            }
            echo '<form method="POST" action=".php">
                    <input type="submit" class="btn btn-light" value="⬅ Torna Indietro"/>
                </form>';
        }
        ?>
        <script src="BetterWays-AmiciDiSissi/JS/menus/single-marker-menu.js"></script>
        <script src="BetterWays-AmiciDiSissi/JS/menus/packages-menu.js"></script>
    </body>
</html>