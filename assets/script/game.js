
requirejs(['assets/script/question']);
requirejs(['assets/script/answer']);

class Game {

    static get questionAmount() { return 10; }
    static get category() { return 18; }
    static get gameType() { return 'multiple'; }

    constructor(difficulty) {
        console.log('New game started in mode ' + difficulty);

        this.questions = [];
        this.currentQuestion = -1;
        this.answers = [];
        this.points = 0;

        this.timer = undefined;
        this.time = 30 * 60;
    }

    fetchQuestions() {

        $.ajax({
            url: 'https://opentdb.com/api.php?amount=' + Game.questionAmount + '&category=' + Game.category + '&type=' + Game.gameType + '&difficulty=easy',
            success: (data) => {

                data['results'].forEach((question, index) => this.createQuestion(question));

                // Init game
                this.updateTimerUI();
                $('#loader').fadeOut();
                setTimeout(() => {

                    // Let's mix questions :)
                    this.questions = shuffle(this.questions);

                    // First question!
                    this.nextQuestion();
                    $('#newGameNav').fadeIn();
                    $('#time').fadeIn();
                    this.timer = setInterval(() => {
                        this.time--;

                        this.updateTimerUI();

                        if(this.time <= 0) {
                            this.closeGame();
                        }

                    }, 1000);

                }, 400);

            },
        });

    }

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
                this.closeGame();
                break;
            default:
                // Next question
                gameElem.fadeOut();
                setTimeout(() => {
                    next();
                }, 400);
        }

    }

    closeGame() {
        clearInterval(this.timer);
        $('#game').fadeOut();
        $('#newGameNav').fadeOut();
        setTimeout(() => {
            this.showResults();
        }, 400);
    }

    updateTimerUI() {
        $('.mins').text(pad(Math.floor(this.time / 60), 2));
        $('.secs').text(pad(Math.floor(this.time % 60), 2));
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
            this.points = this.points + 3;

        }

        // Update UI
        $('.points .value').animateNumber({ number: this.points }).prop('number', this.points);
    }

    draw() {

        const questionHTML = '<h3>' + this.questions[this.currentQuestion].question + '</h3>';

        const answers = shuffle(this.questions[this.currentQuestion].answers);
        let answersHTML = '';
        answers.forEach(answer => answersHTML += '<label class="radio answer"><input type="radio" name="answer" class="mr-2" value="' + answer.id + '"><span>' + answer.answer + '</span></label>');

        const nextBtnHTML = '<button type="button" id="nextQuestion" class="btn btn-primary mt-3">Successiva</button>';

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
            comment = 'Hai passato la prova. Congratulazioni!';
        } else {
            if(risposteCorrette >= 18 && risposteCorrette < 30) {
                comment = 'Hai superato la prova';
            } else {
                comment = 'NON hai superato la prova';
            }
        }
        comment = '<div class="mt-3 mb-5 comment">' + comment + '</div>';

        $('#game').html(result + comment).fadeIn();

        setTimeout(() => {
            $('#newSession').text('Home').click(function() {
                location.reload();
            }).fadeIn();
        }, 1500);

    }

}
