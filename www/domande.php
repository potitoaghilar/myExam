<?php
require 'requires.php';


$xml = simplexml_load_file("../setup/questions.xml") or die("Errore");

$data = json_encode($xml);
//$data = json_decode($data,true);
print $data;

?>