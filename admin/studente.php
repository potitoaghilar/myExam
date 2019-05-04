<?php
//ini_set('display_errors', 1);
//ini_set('display_startup_errors', 1);
//error_reporting(E_ALL);

$matricola=568254;
//get question list
class Answer{
    public $id;
    public $text;
	public $corrected;
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
$connect = new mysqli('localhost:8889','root','root','esame');

// Eseguo la query per prelevare le domande
$getquestions = $connect->query("Select * from questions");

$correctanswers = [];

//ottengo elenco domande con relative risposte
while($gettedquestion = $getquestions->fetch_array()){

    $outputanswers = [];
    $question->text = $gettedquestion['text'];
    $question->id = $gettedquestion['id'];
    // Eseguo la query per prelevare le risposte
    $getanswers = $connect->query("Select * from answers where id_question=" . $gettedquestion['id']);
    while($gettedanswer = $getanswers->fetch_array()){
        $answer->id = $gettedanswer['id'];
        $answer->text = $gettedanswer['text'];
		$answer->corrected = $gettedanswer['correct'];
		if($answer->corrected==1){
		$correctanswers[$question->id] =$gettedanswer['id'];
		}
        array_push($outputanswers, $answer);
        unset($answer);
    }

    // Inserisco l'elenco delle risposte nell'oggetto delle domande
    $question->answers = $outputanswers;
	$outputquestions[$question->id]=$question;
    unset($question);
}
//print json_encode($outputquestions);
//print json_encode($correctanswers);
//prelevo risposte studente

$GetAnswers = $connect->query("Select * from users_answers where matricola_user=" . $matricola) or die ("errore");
$corrette = 0;
$insertedAnswers = [];
while($GivedAnswers=$GetAnswers->fetch_array()){
	$insertedAnswers[$GivedAnswers['id_question']]=$GivedAnswers['id_answer'];
	if($GivedAnswers['id_answer']==$correctanswers[$GivedAnswers['id_question']]){
		$corrette++;
	}
	$GivedAnswers['id_answer'];
	$GivedAnswers['id_question'];
}


//print json_encode($insertedAnswers);

	echo "<table>";

$corrette=0;
//stampo scheda esame studente
foreach($outputquestions as $quest){
	echo "<tr><th>".$quest->text."</th></tr><tr><td><ol>";
	
	foreach($quest->answers as $answer){
		echo "<li>".$answer->text;
		if($answer->corrected==1){
			print "(Risposta Corretta)";
		}
		if($answer->id==$insertedAnswers[$quest->id]){
			print "(Risposta Selezionata)";
			$corrette++;
		}
		print "</li>";
	}
	echo "</ol></td></tr>";
}
print "</table>";

print "Risposte corrette".$corrette;
//print json_encode($outputquestions);
?>
