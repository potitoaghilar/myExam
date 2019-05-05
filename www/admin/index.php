<?php

require 'requires.php';

$connect = Database::getInstance();
$query = $connect->query("Select * from results order by cognome");

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
        while($risultato = $query->fetch_assoc()){

            $votofinale = $risultato['punteggio']+$risultato['bouns']-$risultato['malus'];

            print"<tr>
            <td>".$risultato['matricola']."</td>
            <td>".$risultato['nome']."</td>
            <td>".$risultato['cognome']."</td>
            <td>".$risultato['punteggio']."</td>
            <td>".$risultato['bouns']."</td>
            <td>".$risultato['malus']."</td>
            <td>".$votofinale."</td></tr>";

        }
    ?>

</table>

<?php $connect->close(); ?>