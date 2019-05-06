<?php
require 'requires.php';

if(!file_exists('../../setup/questions.xml')) {
    print "Installazione già eseguita.";
    return;
}

$xml = simplexml_load_file("../../setup/questions.xml") or die("Errore");

$data = json_encode($xml);
$data = json_decode($data,true);

$connect = Database::getInstance();

// Inizializzo db
$reset = [];
$reset[0] = "SET foreign_key_checks = 0";
$reset[1] = "truncate table users_answers";
$reset[2] = "truncate table users";
$reset[3] = "truncate table answers";
$reset[4] = "truncate table questions";
$reset[5] = "ALTER TABLE answers AUTO_INCREMENT = 0";
$reset[6] = "ALTER TABLE users AUTO_INCREMENT = 0";
$reset[7] = "ALTER TABLE questions AUTO_INCREMENT = 0";
$reset[8] = "Alter table users_answers AUTO_INCREMENT = 0";
$reset[9] = "SET foreign_key_checks = 1";

foreach($reset as $resetQuery){
    $reset = $connect->query($resetQuery);
}
// Fine

foreach($data['question'] as $questItem){
    $query = $connect->query("Insert into questions (text) values ('".$questItem['text']."')");

    $id = $connect->insert_id;
    $query = $connect->query("Insert into answers (text,id_question,correct) values ('".$questItem['correctAnswer']."','".$id."',1)");

    foreach($questItem['answer'] as $answerItem){
        $query = $connect->query("Insert into answers (text,id_question,correct) values ('".$answerItem."','".$id."',0)") or die("errore");
    }
}

print "Installazione eseguita con successo.\n";

if(!isset($_GET['keep-source'])) {
    unlink("../../setup/questions.xml");
    print "File delle domande eliminato";
}
