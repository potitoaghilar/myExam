requirejs(['assets/script/game']);
requirejs(['assets/script/utils']);

let translate = false;

$(document).ready(function() {

    const newGameBtn = $('#newGame');

    newGameBtn.popover({
        content: () => {

            const easyBtn = $('<button id="newGameEasy" type="button" class="btn btn-primary">Easy</button>');
            const mediumBtn = $('<button id="newGameMedium" type="button" class="btn btn-warning mx-2">Medium</button>');
            const difficulBtn = $('<button id="newGameDifficult" type="button" class="btn btn-danger">Difficult</button>');

            // Binds functions
            setTimeout(function() {
                $('#newGameEasy').click(() => {
                    newGameBtn.popover('dispose');
                    newGame(difficulties.EASY);
                });
                $('#newGameMedium').click(() => {
                    newGameBtn.popover('dispose');
                    newGame(difficulties.MEDIUM);
                });
                $('#newGameDifficult').click(() => {
                    newGameBtn.popover('dispose');
                    newGame(difficulties.HARD);
                });
            }, 200);

            return [easyBtn, mediumBtn, difficulBtn];
        },
        html: true,
        placement: "bottom",
        title: "Select difficulty",
    });

    function newGame(difficulty) {

        // Prepare environment
        $('.logo').removeClass('col-9').addClass('col-6').addClass('minimized');
        newGameBtn.fadeOut();
        setTimeout(function () {

            $('#loader').fadeIn();

            // Instantiate game
            const game = new Game(difficulty);
            game.fetchQuestions();

        }, 1000);

    }

});
