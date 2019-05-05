<?php

require 'requires.php';

// Create database connection
$connect = Database::getInstance();

// Get required data for login
$matricola = $_POST['matricola'];
$id_answer = $_POST['answer_id'];
$id_question = $_POST['question_id'];

// TODO aggiungere il controllo sulla chiusura dell'esame

// Save given answer
$query = $connect->query("INSERT INTO users_answers (matricola_user, id_answer, id_question) VALUES('".$matricola."','".$id_answer."','".$id_question."') ON DUPLICATE KEY UPDATE id_answer='".$id_question."';");

// Send result to client
$response = new Response();
if($query) {
	$response->status = "success";
	$response->message = "Risposta salvata";
}
else {
	$response->status = "error";
	$response->message = "Risposta non salvata";
}

// Close database connection
$connect->close();

// Send result to client
print json_encode($response);