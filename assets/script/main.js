
// Required components useful to execution of web application
requirejs(['assets/script/game']);
requirejs(['assets/script/utils']);

$(document).ready(function() {

    // Start a new session when we click on "Avvia Esame"
    $('#newSession').click(newGame);

    function newGame() {

        // Prepare environment with some visual effects
        $('.logo').removeClass('col-9').addClass('col-6');
        $('.exam-title').fadeOut();
        $('#newSession').fadeOut();

        // Timer useful to wait the transitions triggered above
        setTimeout(function () {

            // Show the Loading spinner
            $('#loader').fadeIn();

            // Instantiate game
            const game = new Game();

            // Fetch the questions from external API
            game.fetchQuestions();

        }, 1000);

    }

});
