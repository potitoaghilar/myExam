<?php
/*
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL); 
*/
header("Content-Type: application/json; charset=UTF-8");
$connessione = new mysqli('localhost:8889','root','root','esame');
$query = $connessione->query("Select * from questions;");
$num=0;
$i=0;
print '{
  "response_code": 0,
  "results": [';
while($risultato= $query->fetch_assoc()){
	$i++;
	print '    {
      
      "question": "'.$risultato['question'].'",
      "correct_answer": "'.$risultato['correct_answer'].'",
      "incorrect_answers": ["'.$risultato['incorrect1'].'","'.$risultato['incorrect2'].'","'.$risultato['incorrect3'].'"]
    }';
	if($i<30){
		print ',';
	}	
}
print ' ]}';

$connessione ->close();



?>