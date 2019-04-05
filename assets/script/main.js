requirejs(['assets/script/game']);
requirejs(['assets/script/utils']);

$(document).ready(function() {

    const newGameBtn = $('#newGame');

    newGameBtn.popover({
        content: () => {

            const easyBtn = $('<button id="newGameEasy" type="button" class="btn btn-primary">Facile</button>');
            const mediumBtn = $('<button id="newGameMedium" type="button" class="btn btn-warning mx-2">Medio</button>');
            const difficulBtn = $('<button id="newGameDifficult" type="button" class="btn btn-danger">Difficile</button>');

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
        title: "Scegli il livello di difficoltà",
    });

    function newGame(difficulty) {

        // Prepare environment
        $('.logo').addClass('minimized');
        newGameBtn.fadeOut();

        // Instantiate game
        const game = new Game(difficulty);
        game.fetchQuestions();

        console.log(game.questions);

    }

});
