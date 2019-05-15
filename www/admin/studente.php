<?php

require 'requires.php';
require 'head.php';

$connect = Database::getInstance();

$matricola=$_GET['matricola'];

$getUserDetails = $connect->query("Select * from users where matricola='".$matricola."'");
$user=$getUserDetails->fetch_assoc();

// Inizializzo variabili
$outputquestions = [];

// Eseguo la query per prelevare le domande
$getquestions = $connect->query("Select * from questions");

// Ottengo elenco domande con relative risposte
while($gettedquestion = $getquestions->fetch_array()) {

    $question = new Question();
    $question->text = $gettedquestion['text'];
    $question->id = $gettedquestion['id'];

    // Eseguo la query per prelevare le risposte
    $outputanswers = [];
    $getanswers = $connect->query("Select * from answers where id_question=" . $gettedquestion['id']);
    while($gettedanswer = $getanswers->fetch_array()) {

        $answer = new Answer();
        $answer->id = $gettedanswer['id'];
        $answer->text = $gettedanswer['text'];
        $answer->corrected = $gettedanswer['correct'];
        
        array_push($outputanswers, $answer);

    }

    // Inserisco l'elenco delle risposte nell'oggetto delle domande
    $question->answers = $outputanswers;
    $outputquestions[$question->id]=$question;
    
}

// Prelevo risposte studente
$getAnswers = $connect->query("Select * from users_answers where matricola_user='" . $matricola."'") or die ("errore");
$corrette = 0;
$insertedAnswers = [];
while($givedAnswers = $getAnswers->fetch_array()){
	$insertedAnswers[$givedAnswers['id_question']] = $givedAnswers['id_answer'];
	if($givedAnswers['id_answer'] == $outputquestions[$givedAnswers['id_question']]->getCorrectAnswer()->id){
		$corrette++;
    }
}

?>

<body>

    <section class="container my-4">
        <div class="col-3 mx-auto">
            <img class="main-logo" src="../assets/img/logo.png">
        </div>
    </section>

    <div class="mb-4 text-center">
        <h3><?= $examTitle ?></h3>
        <div class="user-data">
			<?php 
	if($corrette+$user['bonus']+$user['malus']>30)
	{
		$finale="30L";
	}
			else{
				$finale=$corrette+$user['bonus']-$user['malus'];
			}
			?>

            <span>Nome: <b><?= $user['nome'] ?></b></span>
            <span>Cognome: <b><?= $user['cognome'] ?></b></span>
            <span>Matricola: <b><?= $user['matricola'] ?></b></span>
            <span>Risposte corrette: <b><?= $corrette ?></b></span>
			<span>Bonus: <input id="bonus" class="points" data-action="changeBonus" type="number" value="<?= $user['bonus'] ?>" style="width:46px"></span>
			<span>Malus: <input id="malus" class="points"  data-action="changeMalus" type="number" value="<?= $user['malus'] ?>" style="width:46px"></span>
			<span id="finalVale">Voto Finale: <b id="labelPoints"><?=$finale ?></b></span>
        </div>
    </div>

    <section class="container">

        <table>

            <?php

            // Stampo scheda esame studente
            foreach ($outputquestions as $quest): ?>

                <tr><th><?= $quest->text ?></th></tr>
                <tr>
                    <td>
                        <ol>
                            <?php foreach ($quest->answers as $answer): ?>
                                <li>
                                    <?= $answer->text ?>
                                    <?= $answer->corrected == 1 ? ' (Risposta Corretta)' : '' ?>
                                    <?= @($answer->id==$insertedAnswers[$quest->id]) ? ' (Risposta Selezionata)' : '' ?>
                                </li>
                            <?php endforeach; ?>
                        </ol>
                    </td>
                </tr>

            <?php endforeach; ?>

        </table>

    </section>

    <?php require 'footer.php'; ?>

    <script>
		$('.points').change(function() {
			
			var bonus=$('#bonus').val();
			var malus = $('#malus').val();
            var matricola = '<?= $user['matricola'] ?>';
			
            switch ($(this).attr('data-action')) {
                case 'changeBonus':
					var type = 'bonus';
					var amount = bonus;
                    
                    break;
                case 'changeMalus':
					var type = 'malus';
					var amount = malus;
                   
					break;
            }
			$.ajax({
            type: 'POST',
            url: 'updatePoints.php',
            data: {amount, type, matricola},
            success: function(response) {
                alert(response.message);
				votofinale = parseInt(<?= $corrette ?>) + parseInt(bonus) - parseInt(malus);
				if(votofinale>30){
						votofinale ="30L";
					}
		$('#labelPoints').html(votofinale);
            }
        });
			
			
        });


    </script>

</body>