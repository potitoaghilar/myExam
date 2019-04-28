
// Required components
requirejs(['assets/script/question']);
requirejs(['assets/script/answer']);

/***
 * The main class Game
 */
class Game {

    // Static properties of the game itself, these depends from API specifications
    static get questionAmount() { return 10; }
    static get category() { return 18; }
    static get gameType() { return 'multiple'; }

    constructor(difficulty) {
        console.log('New game started in mode ' + difficulty);

        // Set the main fields of the object Game we are creating in this moment
        this.questions = [];
        this.currentQuestion = -1;
        this.answers = [];
        this.points = 0;

        // The timer fields are useful for remaining time tracking
        this.timer = undefined;
        this.time = 30 * 60;
    }

    // Function used to start the game. This fetches the answers from API and start the execution of the session
    fetchQuestions() {

        // Make an HTTP request to provided API url with the params choosen from us: questions amount, category, and difficulty
        $.ajax({
            url: 'https://opentdb.com/api.php?amount=' + Game.questionAmount + '&category=' + Game.category + '&type=' + Game.gameType + '&difficulty=easy',
            success: (data) => {

                // Create the questions from API response
                data['results'].forEach((question, index) => this.createQuestion(question));

                // Init game

                // Update the user interface timer
                this.updateTimerUI();
                // Hide the loader
                $('#loader').fadeOut();
                setTimeout(() => {

                    // Let's mix questions :)
                    this.questions = shuffle(this.questions);

                    // Show first question!
                    this.nextQuestion();
                    $('#newGameNav').fadeIn();
                    $('#time').fadeIn();

                    // Timer that update the remaining time
                    this.timer = setInterval(() => {

                        // Decrease the time
                        this.time--;

                        // Update changes to UI
                        this.updateTimerUI();

                        // Close the session if the time is out
                        if(this.time <= 0) {
                            this.closeGame();
                        }

                    }, 1000);

                }, 400);

            },
        });

    }

    createQuestion(questionData) {

        // Define a container for all generated questions
        let answers = [];

        // Create correct answer
        answers.push(new Answer(randomInt(), questionData['correct_answer'], true));

        // Create wrong answers
        questionData['incorrect_answers'].forEach((answer) => answers.push(new Answer(randomInt(), answer)));

        // Put correct and wrong answers together
        this.questions.push(new Question(questionData['question'], answers));
    }

    nextQuestion() {

        // Variables
        const gameElem = $('#game');
        const next = () => {

            // Increment question counter and update UI
            this.currentQuestion++;
            this.draw();

            // Fadein animation
            gameElem.fadeIn();
        };

        // Choose if the application must show the first answer, a generic answers or the final result
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

    // Close the session and show the results
    closeGame() {

        // Remove the timer
        clearInterval(this.timer);

        // Hide session page
        $('#game').fadeOut();
        $('#newGameNav').fadeOut();

        // Show results page
        setTimeout(() => {
            this.showResults();
        }, 400);
    }

    // Update time UI: minutes and seconds
    updateTimerUI() {
        $('.mins').text(pad(Math.floor(this.time / 60), 2));
        $('.secs').text(pad(Math.floor(this.time % 60), 2));
    }

    // Save the answer provided from user
    saveAnswer() {

        let isCorrect = false;

        // Check if answer is correct
        if(parseInt($(".answer input:checked").first().val()) === this.questions[this.currentQuestion].getCorrect().id) {
            isCorrect = true;
        }

        // Update points in UI
        this.updatePoints(isCorrect);

        // Save result
        this.answers.push(isCorrect);

        return isCorrect;

    }

    // Update the points
    updatePoints(answer) {
        if(answer) {

            // Add points to total
            this.points = this.points + 3;

        }

        // Update UI
        $('.points .value').animateNumber({ number: this.points }).prop('number', this.points);
    }

    // This method updates the UI showing the question on the screen
    draw() {

        // Generate the question HTML
        const questionHTML = '<h3>' + this.questions[this.currentQuestion].question + '</h3>';

        // Get and mix the answers for the provided question
        const answers = shuffle(this.questions[this.currentQuestion].answers);
        // Generate the answers HTML through radio buttons
        let answersHTML = '';
        answers.forEach(answer => answersHTML += '<label class="radio answer"><input type="radio" name="answer" class="mr-2" value="' + answer.id + '"><span>' + answer.answer + '</span></label>');

        // Generate the next question button HTML
        const nextBtnHTML = '<button type="button" id="nextQuestion" class="btn btn-primary mt-3">Successiva</button>';

        // Prints all the generated HTML to screen
        $('#game').html(questionHTML + '<div class="mx-auto mt-3 w-50 text-left">' + answersHTML + '</div>' + nextBtnHTML);

        // Add click listener to nextQuestion Button
        const that = this;
        $('#nextQuestion').click(function() {

            // Unbind the click action to avoid answer spamming! (IMPORTANT)
            $(this).unbind();

            // Get the selected answer that the user selected
            const selectedAnswer = $(".answer input:checked").first();

            if(selectedAnswer.val() !== undefined) {

                // Save user answer
                let isCorrect = that.saveAnswer();

                // Mark correct and wrong answers
                if(isCorrect) {
                    // Mark as correct
                    selectedAnswer.parent().addClass('correct')
                } else {
                    // Mark as wrong
                    selectedAnswer.parent().addClass('wrong');
                    // Highlight the correct answer
                    $(".answer input[value=" + that.questions[that.currentQuestion].getCorrect().id + "]").first().parent().addClass('correct');
                }

                // Go to next question
                setTimeout(() => that.nextQuestion(), 1000);

            }
        });
    }

    // Show points to screen with an incremental animation
    static showPoints() {
        $('.points').animate({width: '40%'}, 400).fadeTo(400, 1);
    }

    // Show results page on UI
    showResults() {

        // Count correct answers
        const risposteCorrette = this.answers.filter(x => x === true).length;

        // Generate HTML for correct answers text
        const result = '<div class="summaryLabel">Risposte corrette</div><div class="summary">' + risposteCorrette + '<span>/' + Game.questionAmount + '</span></div>';

        // Generate HTML for comment text based on collected points
        let comment = '';
        if(this.points == 30) {
            comment = 'Hai passato la prova. Congratulazioni!';
        } else if (this.points >= 18 && this.points < 30) {
            comment = 'Hai superato la prova';
        } else {
            comment = 'NON hai superato la prova';
        }
        comment = '<div class="mt-3 mb-5 comment">' + comment + '</div>';

        // Show HTML on UI
        $('#game').html(result + comment).fadeIn();

        // Show Home button after a delay of 1.5 seconds
        setTimeout(() => {
            $('#newSession').text('Home').click(function() {
                location.reload();
            }).fadeIn();
        }, 1500);

    }

}
