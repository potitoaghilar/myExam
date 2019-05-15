<?php

require_once 'requires.php';

// Get matricola
$matricola = $_GET['matricola'];

// Get database instance
$connect = Database::getInstance();

// Get time of provided user's matricola
$getTime = $connect->query("SELECT TIME_TO_SEC(TIMEDIFF(NOW(), start)) seconds from users where matricola='" . $matricola."'");

// Get elapsed time
$elapsedTime = 0;
while($getTime && $gettedtime = $getTime->fetch_array()){
    $elapsedTime = $gettedtime['seconds'];
}

// Return time in seconds
echo json_encode([
    'time' => $maxtime - $elapsedTime
]);
