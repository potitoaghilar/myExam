requirejs(['assets/script/game']);
requirejs(['assets/script/utils']);

$(document).ready(function() {

    $('#newSession').click(newGame);

    function newGame() {

        // Prepare environment
        $('.logo').removeClass('col-9').addClass('col-6');
        $('.exam-title').fadeOut();
        $('#newSession').fadeOut();
        setTimeout(function () {

            $('#loader').fadeIn();

            // Instantiate game
            const game = new Game();
            game.fetchQuestions();

        }, 1000);

    }

});
