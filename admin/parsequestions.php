<?php
if(file_exists('questions.xml'))
{
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
	print $data;
$data= json_decode($data,true);
	print_r($data);

$connect = Database::getInstance();
	
//Inizializzo db
	print "truncate table answers; truncate table questions; truncate table users; truncate table users_answers; ALTER TABLE answers AUTO_INCREMENT = 0;ALTER TABLE users AUTO_INCREMENT = 0;ALTER TABLE users_answers AUTO_INCREMENT = 0;ALTER TABLE questions AUTO_INCREMENT = 0;";
	$reset = $connect->query("truncate table answers; truncate table questions; truncate table users; truncate table users_answers; ALTER TABLE answers AUTO_INCREMENT = 0;ALTER TABLE users AUTO_INCREMENT = 0;ALTER TABLE users_answers AUTO_INCREMENT = 0;ALTER TABLE questions AUTO_INCREMENT = 0;") or die("errore:");
	
	foreach($reset as $resetQuery){
		$reset = $connect->query($resetQuery);
	}
	
	
	
//fine	

foreach($data['quest'] as $questItem){
	$query = $connect->query("Insert into questions (text) values ('".$questItem['text']."')") or die("errore");
	
	print "Insert into questions (text) values ('".$questItem['text']."')";
	
	$id = $connect->insert_id;
	$query = $connect->query("Insert into answers (text,id_question,correct) values ('".$questItem['correctAnswer']."','".$id."',1)")  or die("errore");
	
	print "Insert into answers (text,id_question,correct) values ('".$questItem['correctAnswer']."','".$id."',1)";
	foreach($questItem['answer'] as $answerItem){
		$query = $connect->query("Insert into answers (text,id_question,correct) values ('".$answerItem."','".$id."',0)") or die("errore");
		
		print "Insert into answers (text,id_question,correct) values ('".$answerItem."','".$id."',0)";
	}	
}
	// unlink("questions.xml"); 
	print "Installazione eseguita con successo. File delle domande eliminato";
}
else{
	print "installazione già eseguita";
}
?>