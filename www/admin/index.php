<?php

require 'requires.php';

$connect = Database::getInstance();

?>

<style>
    table {
        border-collapse: collapse;
        width: 500px;
    }

    th, td {
        text-align: left;
        padding: 8px;
    }

    tr:nth-child(even) {background-color: #f2f2f2;}
</style>

<table style="margin:0 auto;">
    <tr>
        <th>Matricola</th>
        <th>Nome</th>
        <th>Cognome</th>
        <th>Puntaggio</th>
        <th>Bouns</th>
        <th>Malus</th>
        <th>Voto Finale</th>
    </tr>
<?php
	
	function Points($matricola){
		$connect = Database::getInstance();
		$GetResult = $connect->query("Select count(case correct when 1 then 1 else null end) as TestResult  from users_answers inner join answers on id_answer=answers.id where users_answers.matricola_user=".$matricola);

		// Fetch result as an associative array
		$summary = $GetResult->fetch_array();
		return $summary['TestResult'];
	}

	$query = $connect->query("Select * from users order by cognome");
    while($risultato = $query->fetch_assoc()) {

        $points = Points($risultato['matricola']);
        $votofinale = $points+$risultato['bonus'] - $risultato['malus'];

        print"<tr>
        <td><a href='/admin/studente.php?matricola=".$risultato['matricola']."'>".$risultato['matricola']."</a></td>
        <td>".$risultato['nome']."</td>
        <td>".$risultato['cognome']."</td>
        <td>".$points."</td>
        <td>".$risultato['bonus']."</td>
        <td>".$risultato['malus']."</td>
        <td>".$votofinale."</td></tr>";

    }
?>

</table>

<?php $connect->close(); ?>