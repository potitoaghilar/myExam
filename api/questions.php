<?php

header("Content-Type: application/json; charset=UTF-8");

// Definisco Classi
class Answer{
    public $id;
    public $text;
}

class Question{
    public $id;
    public $text;
    public $answers = [];
}

// Inizializzo variabili
$question = new Question;
$answer = new Answer;
$outputquestions = [];

// Creo la connessione con il db
$connect = new mysqli('localhost:3306','root','Poti1997$','esame');
//$connect = new mysqli('localhost:8889','root','root','esame');

// Eseguo la query per prelevare le domande
$getquestions = $connect->query("Select * from questions");

while($gettedquestion = $getquestions->fetch_array()){

    $outputanswers = [];
    $question->text = $gettedquestion['text'];
    $question->id = $gettedquestion['id'];

    // Eseguo la query per prelevare le risposte
    $getanswers = $connect->query("Select * from answers where id_question=" . $gettedquestion['id']);
    while($gettedanswer = $getanswers->fetch_array()){
        $answer->id = $gettedanswer['id'];
        $answer->text = $gettedanswer['text'];
        array_push($outputanswers, $answer);
        unset($answer);
    }

    // Inserisco l'elenco delle risposte nell'oggetto delle domande
    $question->answers = $outputanswers;

    // Popolo l'array delle domande con relative risposte
    array_push($outputquestions, $question);
    unset($question);
}

// Genero il json
print json_encode($outputquestions);

// Chiudo la connessione con il database
$connect->close();
