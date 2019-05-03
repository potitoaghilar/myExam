<?php
header("Content-Type: application/json; charset=UTF-8");
//definisco classi
class Answer{
	public $text;
	public $answerid;
}
class Question{
	public $text;
	public $questionid;
	public $answers = [];	
}
//inizializzo variabili
$question = new Question;
$answer = new Answer;
$outputquestions =[];
//creo la connessione con il db
$connect = new mysqli('localhost:8889','root','root','esame');
//eseguo la query per prelevare le domande
$getquestions = $connect->query("Select * from questions");

while($gettedquestion=$getquestions->fetch_array()){
	$outputanswers=[];
	$question->text = $gettedquestion['text'];
	$question->questionid = $gettedquestion['id'];
	//eseguo la query per prelevare le risposte
	$getanswers = $connect->query("Select * from answers where id_question=".$gettedquestion['id']);
	while($gettedanswer=$getanswers->fetch_array()){
		$answer->answerid=$gettedanswer['id'];
		$answer->text=$gettedanswer['text'];
		array_push($outputanswers,$answer);
		unset($answer);
	}
	//inserisco l'elenco delle risposte nell'oggetto delle domande
	$question->answers = $outputanswers;
	//popolo l'array delle domande con relative risposte
	array_push($outputquestions,$question);
	unset($question);
}
//genero il json
print json_encode($outputquestions);
//chiudo la connessione con il database
$connect->close();


?>
