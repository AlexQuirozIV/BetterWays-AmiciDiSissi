<!DOCTYPE html>
<html>
    <head>
        <title>Gestione Utenti</title>
    </head>
    <body>
    <!--
        <nav class="navbar navbar-expand-sm navbar-light bg-light">
            <a class="navbar-brand" href="mainPage.php">GestioneUtenti</a>
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
            $nome = isset($_POST['nome']) ? $_POST['nome'] : NULL;
            $cognome = isset($_POST['cognome']) ? $_POST['cognome'] : NULL;
            $email = isset($_POST['email']) ? $_POST['email'] : NULL;
            $password = isset($_POST['password']) ? $_POST['password'] : NULL;

            $query = "INSERT INTO user (nome, cognome, email, password)
                    VALUES ('$nome', '$cognome', '$email', '$password')";

            $result = pg_query($conn, $query);
            if ($result) {
                echo("<br>Utente inserito correttamente!<br><br>");
            } else {
                echo("<br>Utente NON inserito correttamente.<br><br>");
            }

            echo '<h3>Tabella Completa</h3>';
            $query = "SELECT * FROM user";

            $result = pg_query($conn, $query);

            if (!$result) {
                echo "Errore.<br/>";
                echo pg_last_error($conn);
                exit();
            } else {
                echo '<table id="tabellaUser" class="table table-bordered caption-top">';
                echo '<caption class="text-center">Utenti</caption>';
                echo '<thead class="table-light">';
                    echo '<tr>';
                        echo '<th scope="col">Nome</th>';
                        echo '<th scope="col">Cognome</th>';
                        echo '<th scope="col">Email</th>';
                    echo '</tr>';
                echo '</thead>';
                echo '<tbody>';
                while ($row = pg_fetch_array($result)) {
                    echo '<tr>';
                    echo '<td>' . $row['nome'] . '</td>';
                    echo '<td>' . $row['cognome'] . '</td>';
                    echo '<td>' . $row['email'] . '</td>';
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
        <script src="BetterWays-AmiciDiSissi/JS/menus/account-menu.js"></script>ù
        <script src="BetterWays-AmiciDiSissi/JS/menus/single-marker-menu.js"></script>
        <script src="BetterWays-AmiciDiSissi/JS/menus/packages-menu.js"></script>
    </body>
</html>