<?php

require_once 'requires.php';

$matricola = $_GET['matricola'];
$questions = 30; // Define questions number
$timequestion = 60; // Seconds for each questions
$maxtime = $questions * $timequestion;

// Get database instance
$connect = Database::getInstance();

$getTime = $connect->query("SELECT TIME_TO_SEC(TIMEDIFF(NOW(), start)) seconds from users where matricola=" . $matricola);

// Get elapsed time
$elapsedTime = 0;
while($getTime && $gettedtime = $getTime->fetch_array()){
    $elapsedTime = $gettedtime['seconds'];
}

// Time in seconds
echo json_encode([
    'time' => $maxtime - $elapsedTime
]);
