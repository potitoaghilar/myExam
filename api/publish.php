<?php
//$matricola = $_GET['matricola'];
//$risultato= $_GET['results'];
//$nome =$_GET['nome'];
//$cognome=$_GET['cognome'];
$connessione = new mysqli('localhost:8889','root','root','esame');
$matricola= 568254;
$id_answer=4;
$id_question = 4;
print "INSERT INTO users_answers (matricola_user, id_answer, id_question) VALUES('".$matricola."','".$id_answer."','".$id_question."') ON DUPLICATE KEY UPDATE id_answer='".$id_question."';";
$query = $connessione->query("INSERT INTO users_answers (matricola_user, id_answer, id_question) VALUES('".$matricola."','".$id_answer."','".$id_question."') ON DUPLICATE KEY UPDATE id_answer='".$id_question."';");;
//$query = $connessione->query("insert into results (matricola,punteggio,nome,cognome) values ('".$matricola."','".$risultato."','".$nome."','".$cognome."')");
//print "insert into results (matricola,punteggio) values ('".$matricola."','".$risultato."')";
$connessione->close();
//print '<div class="success">successo</div>';
?>