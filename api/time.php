<?php
header("Content-Type: application/json; charset=UTF-8");
$matricola=568254;
$questions=30; //define questions number
$timequestion=60; //secondi
$maxtime=$questions*$timequestion;

$connect = new mysqli('localhost:8889','root','root','esame');

$getTime = $connect->query("SELECT TIME_TO_SEC(TIMEDIFF(NOW(), start)) seconds from users where matricola=".$matricola);

while($gettedtime = $getTime->fetch_array()){
	
	$time->time=$gettedtime['seconds'];
}
$time->time=$maxtime-$time->time;
echo json_encode($time); //time in seconds


?>