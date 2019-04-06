//https://translate.yandex.net/api/v1.5/tr.json/translate?text=hello&lang=it&key=trnsl.1.1.20190404T223555Z.8dc52d79cdc709a3.0cacf308c8148501b80f342dd301cdbe03225b1c

requirejs(['assets/script/question']);

const difficulties = Object.freeze({
    'EASY': 0,
    'MEDIUM': 1,
    'HARD': 2,
});

class Game {

    static get questionAmount() { return 10; }
    static get category() { return 18; }
    static get gameType() { return 'multiple'; }

    constructor(difficulty) {
        console.log('New game started in mode ' + difficulty);

        this.difficulty = swap(difficulties)[difficulty].toLowerCase();
        this.questions = [];
        this.currentQuestion = -1;
        this.answers = [];
    }

    fetchQuestions() {

        $.ajax({
            url: 'https://opentdb.com/api.php?amount=' + Game.questionAmount + '&category=' + Game.category + '&type=' + Game.gameType + '&difficulty=' + this.difficulty,
            success: (data) => this.translateQuestions(data),
        });

    }

    translateQuestions(json) {
        json.results.forEach((questionJSON) => {
            // TODO
            this.createQuestion(questionJSON);
        });

        // Init game
        $('#loader').fadeOut();
        setTimeout(() => {

            // Let's mix questions :)
            this.questions = shuffle(this.questions);

            // First question!
            this.nextQuestion();
            $('#newGameNav').fadeIn();

        }, 400);
    };

    createQuestion(questionData) {
        this.questions.push(new Question(questionData['question'], questionData['correct_answer'], questionData['incorrect_answers']));
    }

    nextQuestion() {

        // Variables
        const gameElem = $('#game');
        const next = () => {

            this.currentQuestion++;
            this.draw();

            // Fadein animation
            gameElem.fadeIn();
        };

        switch (this.currentQuestion) {
            case -1:
                // First question
                next();
                break;
            case this.questions.length - 1:
                // This is the last question. So show results
                gameElem.fadeOut();
                $('#newGameNav').fadeOut();
                setTimeout(() => {
                    this.showResults();
                }, 400);
                break;
            default:
                // Next question
                gameElem.fadeOut();
                setTimeout(() => {
                    next();
                }, 400);
        }

    }

    saveAnswer() {

        let correct = false;

        // Check answer
        if($(".answer input:checked").first().val().toLowerCase() === this.questions[this.currentQuestion].correctAnswer.toLowerCase()) {
            correct = true;
        }

        // Save result
        this.answers.push(correct);

    }

    draw() {

        const questionHTML = '<h3>' + this.questions[this.currentQuestion].question + '</h3>';

        const answers = shuffle([].concat(this.questions[this.currentQuestion].incorrectAnswers).concat([this.questions[this.currentQuestion].correctAnswer]));
        let answersHTML = '';
        answers.forEach(answer => answersHTML += '<label class="radio answer"><input type="radio" name="answer" class="mr-2" value="' + answer + '"><span>' + answer + '</span></label>');

        const nextBtnHTML = '<button type="button" id="nextQuestion" class="btn btn-primary mt-3">Avanti</button>';

        $('#game').html(questionHTML + '<div class="mx-auto mt-3 w-50 text-left">' + answersHTML + '</div>' + nextBtnHTML);

        // Add click listener to nextQuestion Button
        $('#nextQuestion').click(() => {
            if($(".answer input:checked").first().val() !== undefined) {
                this.saveAnswer();
                this.nextQuestion();
            }
        });
    }

    showResults() {

        const risposteCorrette = this.answers.filter(x => x === true).length;

        const result = '<div class="summaryLabel">Risposte corrette</div><div class="summary">' + risposteCorrette + '<span>/' + Game.questionAmount + '</span></div>';
        let comment = '';
        if(risposteCorrette === Game.questionAmount) {
            comment = 'Grande, le sai tutte!';
        } else {
            comment = 'Si può sempre migliorare!';
        }
        comment = '<div class="mt-3 mb-5 comment">' + comment + '</div>';

        $('#game').html(result + comment).fadeIn();

        setTimeout(() => {
            $('#newGame').text('Riprova').click(function() {
                location.reload();
            }).fadeIn();
        }, 1500);

    }

}
