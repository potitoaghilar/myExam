<?php

require 'requires.php';

//$matricola = $_GET['matricola'];
//$risultato= $_GET['results'];
//$nome =$_GET['nome'];
//$cognome=$_GET['cognome'];
$connessione = Database::getInstance();
$matricola=$_POST['matricola'];

//$id_answer=4;
//$id_question = 4;



$query =$connessione->query("UPDATE users set end=NOW() where matricola=".$matricola) or die("error");
if($query){
	$response->success="success";
}
else{
	$response->success="error";
}
	$connessione->close();
print json_encode($response);
?>
