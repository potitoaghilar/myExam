//https://translate.yandex.net/api/v1.5/tr.json/translate?text=hello&lang=it&key=trnsl.1.1.20190404T223555Z.8dc52d79cdc709a3.0cacf308c8148501b80f342dd301cdbe03225b1c

requirejs(['assets/script/question']);
requirejs(['assets/script/answer']);

const difficulties = Object.freeze({
    'EASY': 0,
    'MEDIUM': 1,
    'HARD': 2,
});

const pointsMap = Object.freeze({
    0: 20, // EASY
    1: 50, // MEDIUM
    2: 100, // HARD
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
        this.points = 0;
        this.difficultyVal = difficulty; // Used in points computation
    }

    fetchQuestions() {

        $.ajax({
            url: 'https://opentdb.com/api.php?amount=' + Game.questionAmount + '&category=' + Game.category + '&type=' + Game.gameType + '&difficulty=' + this.difficulty,
            success: (data) => this.translateQuestions(data),
        });

    }

    translateQuestions(json) {
        json.results.forEach((questionJSON) => {

            // Translate only if global variable is set
            if(translate) {

                // Prepare data to be translated
                let data = '';
                data += questionJSON.question + '||';
                data += questionJSON.correct_answer + '||';
                data += questionJSON.incorrect_answers[0] + '||';
                data += questionJSON.incorrect_answers[0] + '||';
                data += questionJSON.incorrect_answers[0];

                $.ajax({
                    url: 'https://translate.yandex.net/api/v1.5/tr.json/translate?lang=it&key=trnsl.1.1.20190404T223555Z.8dc52d79cdc709a3.0cacf308c8148501b80f342dd301cdbe03225b1c&text=' + data,
                    success: (data) => {

                        const jsonData = data.text[0].split('||');

                        this.createQuestion({
                            'question': jsonData[0],
                            'correct_answer': jsonData[1],
                            'incorrect_answers': [
                                jsonData[2],
                                jsonData[3],
                                jsonData[4],
                            ],
                        });

                    },
                });
            } else {

                // Otherwise just create a new english question
                this.createQuestion(questionJSON);

            }
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

        let answers = [];

        // Create correct answer
        answers.push(new Answer(randomInt(), questionData['correct_answer'], true));

        // Create wrong answers
        questionData['incorrect_answers'].forEach((answer) => answers.push(new Answer(randomInt(), answer)));

        this.questions.push(new Question(questionData['question'], answers));
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
                Game.showPoints();
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

        let isCorrect = false;

        // Check answer
        if(parseInt($(".answer input:checked").first().val()) === this.questions[this.currentQuestion].getCorrect().id) {
            isCorrect = true;
        }

        // Update points in UI
        this.updatePoints(isCorrect);

        // Save result
        this.answers.push(isCorrect);

        return isCorrect;

    }

    updatePoints(answer) {
        if(answer) {

            // Add points to total
            this.points = this.points + pointsMap[this.difficultyVal];

        } else {

            // Divide total points by 2
            this.points = this.points / 2;

        }

        // Update UI
        $('.points .value').animateNumber({ number: this.points }).prop('number', this.points);
    }

    draw() {

        const questionHTML = '<h3>' + this.questions[this.currentQuestion].question + '</h3>';

        const answers = shuffle(this.questions[this.currentQuestion].answers);
        let answersHTML = '';
        answers.forEach(answer => answersHTML += '<label class="radio answer"><input type="radio" name="answer" class="mr-2" value="' + answer.id + '"><span>' + answer.answer + '</span></label>');

        const nextBtnHTML = '<button type="button" id="nextQuestion" class="btn btn-primary mt-3">Next</button>';

        $('#game').html(questionHTML + '<div class="mx-auto mt-3 w-50 text-left">' + answersHTML + '</div>' + nextBtnHTML);

        // Add click listener to nextQuestion Button
        $('#nextQuestion').click(() => {

            const selectedAnswer = $(".answer input:checked").first();

            if(selectedAnswer.val() !== undefined) {

                // Save user answer
                let isCorrect = this.saveAnswer();

                // Mark correct and wrong answers
                if(isCorrect) {
                    // Mark as correct
                    selectedAnswer.parent().addClass('correct')
                } else {
                    // Mark as wrong
                    selectedAnswer.parent().addClass('wrong');
                    // Highlight correct
                    $(".answer input[value=" + this.questions[this.currentQuestion].getCorrect().id + "]").first().parent().addClass('correct');
                }

                // Go to next question
                setTimeout(() => this.nextQuestion(), 1000);

            }
        });
    }

    static showPoints() {

        $('.points').animate({width: '40%'}, 400).fadeTo(400, 1);

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
