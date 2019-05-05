<?php

require 'requires.php';

// Create database connection
$connessione = Database::getInstance();

// Get matricola
$matricola = $_POST['matricola'];

$response = new Response();

// Set end time for given user'matricola
$query = $connessione->query("UPDATE users set end=NOW() where matricola=$matricola") or die("error");

// Send response to client
if($query) {
	$response->status = "success";
	$response->message = "Esame completato";
} else {
	$response->status = "error";
	$response->message = "Errore nella chiusura dell'esame";
}

// TODO fornire un riepilogo delle domande date - sia quelle date che quelle corrette

print json_encode($response);

// Close database connection
$connessione->close();
