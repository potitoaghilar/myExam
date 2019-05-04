<?php

require 'requires.php';

//$matricola = $_GET['matricola'];
//$risultato= $_GET['results'];
//$nome =$_GET['nome'];
//$cognome=$_GET['cognome'];
$connessione = Database::getInstance();
$matricola=$_POST['matricola'];
$id_answer=$_POST['answer_id'];
$id_question=$_POST['question_id'];
//$matricola= 568254;
//$id_answer=4;
//$id_question = 4;

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
