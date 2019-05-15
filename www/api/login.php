<?php

require 'requires.php';

// Create database connection
$connect = Database::getInstance();

// Generate response object
$message = new Response();

// Get required data for login
$matricola = $_POST['matricola'];
$nome = $_POST['nome'];
$cognome = $_POST['cognome'];


// Check if user has inserted non empty datas
if(empty($matricola) || empty($nome) || empty($cognome)) {
    $message->status = "error";
    $message->message = "I dati inseriti non sono validi.";
    echo json_encode($message);
    return;
}
if(!is_numeric($matricola)){
	$message->status = "error";
    $message->message = "La matricola non è valida.";
    echo json_encode($message);
    return;
}

// Get user from database
$user = mysqli_fetch_object($connect->query("select *, TIME_TO_SEC(TIMEDIFF(NOW(), start)) as deltaTime from users where matricola = '$matricola' limit 1"));

// Check if user already exists
if(!$user) {
	//SQL Attack prevention
	$nome=str_replace("'", "&apos;", $nome);
	$cognome=str_replace("'", "&apos;", $cognome);
    // Insert user in users
    $insertuserdata = $connect->query("Insert into users (matricola,nome,cognome,start) values ('".$matricola."','".$nome."','".$cognome."',NOW())");

    // Return response to client: the exam can start
	$message->status = "success";
	$message->message = [];

} else {

    // Check if user can still continue the exam
    if($user->end == null) {

        // Check if time is out
        if($user->deltaTime >= $maxtime) {

            // Close exam in database
            $connect->query("Update users set end = NOW() where matricola = '$matricola'");

            // Show alert to client
            $message->status = "error";
            $message->message = "L'esame è terminato.";
            echo json_encode($message);
            return;
        }

        // Exam is not ended yet: give success and already given answers
        $message->status = "success";

        // Get given answers from database
        $givenAnswers = [];
        $getAnswers = $connect->query("Select id_question, id_answer from users_answers where matricola_user='".$matricola."'");
        while($answer = $getAnswers->fetch_array()){
            $data = new UserAnswer();
            $data->questionId = intval($answer['id_question']);
            $data->answerId = intval($answer['id_answer']);
            array_push($givenAnswers, $data);
        }

        $message->message = $givenAnswers;

    } else {

        // Exam already closed
        $message->status = "error";
        $message->message = "Con questa matricola hai già svolto l'esame";

    }

}

// Send result to client
echo json_encode($message);

// Close database connection
$connect->close();