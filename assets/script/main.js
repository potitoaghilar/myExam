//https://opentdb.com/api.php?amount=10&category=18&difficulty=easy

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
                    newGame(difficulties.DIFFICULT);
                });
            }, 200);

            return [easyBtn, mediumBtn, difficulBtn];
        },
        html: true,
        placement: "bottom",
        title: "Scegli il livello di difficoltà",
    });

    const difficulties = Object.freeze({
        'EASY': 0,
        'MEDIUM': 1,
        'DIFFICULT': 2,
    });

    function newGame(difficulty) {
        console.log('New game started in mode ' + difficulty);

        // Initialize environment
        $('.logo').addClass('minimized');
        newGameBtn.fadeOut();
    }

});
