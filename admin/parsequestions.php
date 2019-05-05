<?php
require '../api/requires.php';
class Quest{
	public $text;
	public $answers;
}
class Answer{
	public $text;
	public $correct;
}
$quest = new Quest();
$questions =[];
$answer = new Answer();
$answers = [];

$xml=simplexml_load_file("questions.xml") or die("Errore");

$data = json_encode($xml);
$data= json_decode($data,true);

$connect = Database::getInstance();

foreach($data as $questItem){
	$query = $connect->query("Insert into questions (text) values ('".$questItem['text']."')") or die("errore");
	$id = $connect->insert_id;
	$query = $connect->query("Insert into answers (text,id_question,correct) values ('".$questItem['correctAnswer']."','".$id."',1)");
	foreach($questItem['answer'] as $answerItem){
		$query = $connect->query("Insert into answers (text,id_question,correct) values ('".$answerItem."','".$id."',0)");
	}	
}

?>