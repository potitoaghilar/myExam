<?php

header("Content-Type: application/json; charset=UTF-8");
require 'requires.php';

$response = new Response();

$connect = Database::getInstance();

$matricola = $_POST['matricola'];
$type = $_POST['type']; //bonus or malus
$amount = $_POST['amount'];

$query = $connect->query("update users set $type=$amount where matricola=$matricola");

if($query) {
    $response->status = "success";
    $response->message = "Aggiornamento Eseguito con Successo";
} else{
    $response->status = "error";
    $response->message = "Si è verificato un errore in fase di aggiornamento. verificare i dati inseriti";
}

print json_encode($response);
