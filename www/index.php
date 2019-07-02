<?php
    require_once 'security.php';
    
    ?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Politecnico di Bari - Esame</title>

    <link rel="stylesheet" href="assets/style/loader.css">
    <link rel="stylesheet" href="assets/style/radiobutton.css">
    <link rel="stylesheet" href="assets/style/main.css">
</head>
<body>

    <section>
		 <div id="user_details" class="float-left">
            <div id="nameSurname_value"></div>
			 <div id="matricola_value"></div>
        </div>
        <div id="time" class="time float-right text-center">
            <div>Tempo rimanente:</div>
            <span class="value"><span class="mins">00</span>:<span class="secs">00</span></span>
        </div>
    </section>

    <section class="container main-container">
        <div class="col text-center">

            <div class="col-5 my-5 mx-auto">
                <div class="row">
                    <div class="col-9 mx-auto logo">
                        <img class="main-logo" src="assets/img/logo.png">
                    </div>
                    <div class="my-auto questions" style="width: 0; opacity: 0;">
                        <div>Domanda:</div>
                        <span class="questions-done">0</span> / <span class="questions-total">0</span>
                    </div>
                </div>
            </div>

            <!-- Exam title -->
            <h3 id="exam-title" class="mb-5 exam-title">

            </h3>

            <!-- Loader -->
            <div id="loader" class="mt-5" style="display: none;">
                <div class="loader">Caricamento</div>
            </div>

            <!-- Main session container -->
            <div id="session" class="mx-auto w-75" style="display: none;"></div>

            <!-- Input -->
            <div id="login-form">
                <input id="nome" type="text" placeholder="Nome" />
                <input id="cognome" type="text" placeholder="Cognome" />
                <input id="matricola" type="text" placeholder="Matricola" />
                <!-- New Exam Button -->
                <div class="col text-center">
                    <button id="newSession" type="button" class="btn btn-primary mainButton px-4 py-2">Avvia esame</button>
                </div>
            </div>

        </div>

        <div class="modal fade" id="error" tabindex="-1" role="dialog">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Errore</h5>
                        <button type="button" class="close" data-dismiss="modal">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">

                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Chiudi</button>
                    </div>
                </div>
            </div>
        </div>

    </section>

    <footer>
        <div id="navigator"></div>
    </footer>

    <script src="assets/script/core/jquery-3.3.1.min.js"></script>
    <script src="assets/script/core/popper.min.js"></script>
    <script src="assets/script/core/bootstrap.min.js"></script>
    <script src="assets/script/core/jquery.animateNumber.min.js"></script>

    <script src="assets/script/api.js"></script>
    <script src="assets/script/answer.js"></script>
    <script src="assets/script/question.js"></script>
    <script src="assets/script/utils.js"></script>
    <script src="assets/script/session.js"></script>
    <script src="assets/script/main.js"></script>
</body>
</html>