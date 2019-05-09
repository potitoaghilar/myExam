<?php

require 'requires.php';
require 'head.php';

$connect = Database::getInstance();

?>

<body>
    <style>
        table {
            border-collapse: collapse;
            width: 50%;
        }

        th, td {
            text-align: left;
            padding: 8px;
        }

        tr:nth-child(even) {background-color: #f2f2f2;}
    </style>

    <section class="container my-4">
        <div class="col-3 mx-auto">
            <img class="main-logo" src="../assets/img/logo.png">
        </div>
    </section>

    <div class="mb-4 text-center">
        <h3><?= $examTitle ?></h3>
		<h1><a href="lista.php">Stampa Esami studenti</a></h1>
    </div>

    <table style="margin:0 auto;">
        <tr>
            <th>Matricola</th>
            <th>Nome</th>
            <th>Cognome</th>
            <th>Voto prova</th>
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
			
			if($votofinale>30){
				$votofinale ="30L";
			}

            print"<tr>
            <td><a href='/admin/studente.php?matricola=".$risultato['matricola']."'>".$risultato['matricola']."</a></td>
            <td>".$risultato['nome']."</td>
            <td>".$risultato['cognome']."</td>
            <td id='questions".$risultato['matricola']."'>".$points."</td>
            <td><input style='width:40px' type='number' class='points' data-action='changeBonus' matricola='".$risultato['matricola']."' value='".$risultato['bonus']."' id='bonus".$risultato['matricola']."'></td>
            <td><input style='width:40px' type='number' matricola='".$risultato['matricola']."' class='points' data-action='changeMalus' value='".$risultato['malus']."'  id='malus".$risultato['matricola']."'></td>
            <td id='labelPoints".$risultato['matricola']."'>".$votofinale."</td></tr>";

        }
        ?>

    </table>
</body>
<script src="https://code.jquery.com/jquery-3.3.1.min.js"></script>
    <script>
		$('.points').change(function() {
			var matricola=$(this).attr('matricola');
			var amount =parseInt($(this).val());
			var name='#labelPoints'+matricola;
			var name2='#questions'+matricola;
			var points =parseInt($(name2).text());
			var nome3='#bonus'+matricola;
			var nome4='#malus'+matricola;
			var bonus =parseInt($(nome3).val());
			var malus =parseInt($(nome4).val());
			
			
			switch ($(this).attr('data-action')) {
                case 'changeBonus':
					var type = 'bonus'; 
					points = points + amount-malus; //sottrarre malus
					if(points>30){
						points ="30L";
					}
                    break;
                case 'changeMalus':
					var type = 'malus';   
					points = points - amount+bonus; //aggiungere bonus
					if(points>30){
						points ="30L";
					}
					break;
            }
			$.ajax({
            type: 'POST',
            url: 'updatePoints.php',
            data: {amount, type, matricola},
            success: function(response) {
                alert(response.message);
				$(name).html(points);
            }
        });
		});
			
			
</script>
<?php $connect->close(); ?>