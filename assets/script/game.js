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
    };

    createQuestion(questionData) {
        this.questions.push(new Question(questionData.question, questionData['correct_answer'], questionData['incorrect_answers']));
    }

}
