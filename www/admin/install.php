<?php
require 'requires.php';

if(!file_exists('../../setup/questions.xml')) {
    print "Installazione già eseguita.";
    return;
}

$xml = simplexml_load_file("../../setup/questions.xml") or die("Errore");
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

foreach($xml->question as $questItem){
    $query = $connect->query("Insert into questions (text) values ('" . str_replace('\'', '\\\'', $questItem->text) . "')");

    $id = $connect->insert_id;

    foreach($questItem->answer as $answerItem){

        // Check if answer should be saved as correct or wrong
        if($answerItem['correct'] == '1') {
            $isCorrect = 1;
        } else {
            $isCorrect = 0;
        }

        $query = $connect->query("Insert into answers (text,id_question,correct) values ('" . str_replace('\'', '\\\'', $answerItem) . "','" . $id . "', $isCorrect)") or die("errore connessione");
    }
}

print "Installazione eseguita con successo.\n";

if(!isset($_GET['keep-source'])) {
    unlink("../../setup/questions.xml");
    print "File delle domande eliminato";
}
