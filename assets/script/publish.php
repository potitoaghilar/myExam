<?php
$matricola = $_GET['matricola'];
$risultato= $_GET['results'];
$nome =$_GET['nome'];
$cognome=$_GET['cognome'];
$connessione = new mysqli('localhost:8889','root','root','esame');
$query = $connessione->query("insert into results (matricola,punteggio,nome,cognome) values ('".$matricola."','".$risultato."','".$nome."','".$cognome."')");
//print "insert into results (matricola,punteggio) values ('".$matricola."','".$risultato."')";
$connessione->close();
print '<div class="success">successo</div>';
?>
