
<?php


ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);



//$matricola=$_GET['matricola'];
$matricola =568254; //debugonly
$connessione = new mysqli('localhost:8889','root','root','esame');
$datiutente = $connessione->query("Select * from users where matricola=".$matricola);
while($info=$datiutente->fetch_array()){
	print $info['matricola'];
	print $info['nome'];
	print $info['cognome'];
}

//PRELEVO ELENCO DOMANDE UTENTE


// Definisco Classi
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
        array_push($outputanswers, $answer);
        unset($answer);
    }

    // Inserisco l'elenco delle risposte nell'oggetto delle domande
    $question->answers = $outputanswers;
	$outputquestions[$question->id]=$question;
    unset($question);
}

// Genero il json
print json_encode($outputquestions);

print "<hr>";
//ottengo elenco risposte studente
$GivedAnswers = [];


$getGivedAnswers = $connect->query("Select * from users_answers where matricola_user=".$matricola) or die ("error");

//ottengo elenco domande con relative risposte
while($getGivedAnswer = $getGivedAnswers->fetch_array()){

	$GivedAnswers[$getGivedAnswer['id_question']]=$getGivedAnswers['id_answer'];
	print $getGivedAnswers['id_answer'];
}
 
echo json_encode($GivedAnswers);

// Chiudo la connessione con il database
$connect->close();


