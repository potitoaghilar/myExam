//https://opentdb.com/api.php?amount=10&category=18&type=multiple&difficulty=easy
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
            $('#game').fadeIn();
            $('#newGameNav').fadeIn();

        }, 400);
    };

    createQuestion(questionData) {
        this.questions.push(new Question(questionData['question'], questionData['correct_answer'], questionData['incorrect_answers']));
    }

    nextQuestion() {
        this.currentQuestion++;
        this.draw();
    }

    draw() {

        const questionHTML = '<h3>' + this.questions[this.currentQuestion].question + '</h3>';

        const answers = shuffle([].concat(this.questions[this.currentQuestion].incorrectAnswers).concat([this.questions[this.currentQuestion].correctAnswer]));
        let answersHTML = '';
        answers.forEach(answer => answersHTML += '<div class="answer"><input type="radio" name="answer" value="' + answer + '" class="mr-2"> ' + answer + '</div>');

        const nextBtnHTML = '<button type="button" class="btn btn-primary mt-3">Avanti</button>';

        $('#game').html(questionHTML + '<div class="mx-auto mt-3 w-50 text-left">' + answersHTML + '</div>' + nextBtnHTML);
    }

}
