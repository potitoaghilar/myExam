<?php
header("Content-Type: application/json; charset=UTF-8");
//$matricola = $_GET['matricola'];
//$risultato= $_GET['results'];
//$nome =$_GET['nome'];
//$cognome=$_GET['cognome'];
$connessione = new mysqli('localhost:8889','root','root','esame');
$matricola= 568254;
$id_answer=4;
$id_question = 4;

$query = $connessione->query("INSERT INTO users_answers (matricola_user, id_answer, id_question) VALUES('".$matricola."','".$id_answer."','".$id_question."') ON DUPLICATE KEY UPDATE id_answer='".$id_question."';");
if($query){
	$response->success="success";
}
else{
	$response->success="error";
}
	$connessione->close();
print json_encode($response);
?>