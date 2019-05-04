<?php

// TODO
/*
function generateRandomString($length = 10) {
    $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $charactersLength = strlen($characters);
    $randomString = '';
    for ($i = 0; $i < $length; $i++) {
        $randomString .= $characters[rand(0, $charactersLength - 1)];
    }
    return $randomString;
} */

header("Content-Type: application/json; charset=UTF-8");

$matricola=$_POST['matricola'];
$nome=$_POST['nome'];
$cognome=$_POST['cognome'];

class response{
	public $status;
	public $message;
}

$message = new response();

// Creo la connessione con il db
$connect = new mysqli('localhost:8889','root','root','esame');

// Eseguo la query per prelevare le domande
$insertuserdata = $connect->query("Insert into users (matricola,nome,cognome,start) values ('".$matricola."','".$nome."','".$cognome."',NOW())");
if($insertuserdata){
	$message->status="success";
	$message->message="Successo";
}
else{
	$message->status="error";
	$message->message="Con questa matricola, hai gi&agrave; eseguito il test";
}

echo json_encode($message);

/*
// Session cookie
setcookie('session-id', generateRandomString(), 0, "/");

// Error
/*echo json_encode([
    'error' => 'L\'esame è terminato',
    'status' => false,
]);*/

// Success
	/*
echo json_encode([
    'status' => true,
]);
*/
?>