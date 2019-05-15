<?php

require 'requires.php';

$outputquestions = [];

// Create database connection
$connect = Database::getInstance();

// Execute query to fetch questions
$getquestions = $connect->query("Select * from questions order by rand()");

while($gettedquestion = $getquestions->fetch_array()){

    $question = new Question();
    $question->text = $gettedquestion['text'];
    $question->id = $gettedquestion['id'];

    // Execute query to fetch answers

    $outputanswers = [];
	$getanswers = $connect->query("Select * from answers where id_question=" . $gettedquestion['id']);
    while($gettedanswer = $getanswers->fetch_array()){
        $answer = new Answer();
        $answer->id = $gettedanswer['id'];
        $answer->text = $gettedanswer['text'];
        array_push($outputanswers, $answer);
    }

    // Inserisco l'elenco delle risposte nell'oggetto delle domande
    // Return answers in question's relative field
    $question->answers = $outputanswers;

    // Fill questions array
    array_push($outputquestions, $question);
}

// Generate JSON
print json_encode($outputquestions);

// Close database connection
$connect->close();