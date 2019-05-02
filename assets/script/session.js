
/***
 * The main class Session
 */
class Session {

    static get PREVIOUS_QUESTION() { return -1; }
    static get NEXT_QUESTION() { return 1; }

    constructor() {

        // Set the main fields of the object Session we are creating in this moment
        this.questions = [];
        this.currentQuestion = -1;
        this.answers = [];
        this.vote = 0;

        // The timer fields are useful for remaining time tracking
        this.timer = undefined;
        this.time = API.getTime();
    }

    // Function used to start the session. This fetches the answers from API and start the execution of the session
    async fetchQuestions() {

        // Make an HTTP request to provided API url
        const questions = await API.getQuestions();

        // Create the questions from API response
        questions['results'].forEach((question, index) => this.createQuestion(question));

        // Load question number in UI
        $('.questions .questions-total').text(this.questions.length);

        // Init session
        this.initSession();

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

    initSession() {

        // Update the user interface timer
        this.updateTimerUI();

        // Hide the loader
        $('#loader').fadeOut();

        setTimeout(() => {

            // Let's mix questions
            this.questions = shuffle(this.questions);

            // Show question count
            Session.showQuestionsCounter();

            // Show first question
            this.changeQuestion(Session.NEXT_QUESTION);

            // Show timer
            $('#time').fadeIn();

            // Set timer that update the remaining time
            this.timer = this.setTimer();

        }, 400);

    }

    setTimer() {
        return setInterval(() => {

            // Decrease the time
            this.time--;

            // Update changes to UI
            this.updateTimerUI();

            // Close the session if the time is out
            if(this.time <= 0) {
                this.closeSession();
            }

        }, 1000);
    }

    changeQuestion(nextOrPrevious) {

        // Variables
        const change = async () => {

            const sessionElem = $('#session');

            // Fade out only if required
            if (this.currentQuestion > -1) {
                sessionElem.fadeOut();
                await sleep(400);
            }

            // Increment question counter and update UI
            this.currentQuestion += nextOrPrevious;
            this.draw();

            // Fade in animation
            sessionElem.fadeIn();
        };

        // Choose if the application must show the first answer, a generic answers or the final result
        switch (this.currentQuestion) {
            case -1:
                // First question
                change();
                break;
            case this.questions.length - 1:
                // This is the last question. So show results
                this.closeSession();
                break;
            default:
                // Change question
                change();
        }

    }

    // Close the session and show the results
    closeSession() {

        // Remove the timer
        clearInterval(this.timer);

        // Hide session page
        $('#session').fadeOut();

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
    }

    // This method updates the UI showing the question on the screen
    draw() {

        // Update question number on UI
        $('.questions-done').text(this.currentQuestion + 1);

        // Generate the question HTML
        const questionHTML = '<h3>' + this.questions[this.currentQuestion].question + '</h3>';

        // Get and mix the answers for the provided question
        const answers = shuffle(this.questions[this.currentQuestion].answers);
        // Generate the answers HTML through radio buttons
        let answersHTML = '';
        answers.forEach(answer => answersHTML += '<label class="radio answer"><input type="radio" name="answer" class="mr-2" value="' + answer.id + '"><span>' + answer.answer + '</span></label>');

        // Generate the next question button HTML
        const prevBtnHTML = '<button type="button" data-action="previous" class="btn btn-primary mt-3 mr-3 changeQuestion ' + (this.currentQuestion == 0 ? 'disabled' : '') + '">Precedente</button>';
        const nextBtnHTML = '<button type="button" data-action="next" class="btn btn-primary mt-3 changeQuestion ' + (this.currentQuestion == this.questions.length - 1 ? 'disabled' : '') + '">Successiva</button>';

        // Prints all the generated HTML to screen
        $('#session').html(questionHTML + '<div class="mx-auto mt-3 w-50 text-left">' + answersHTML + '</div>' + prevBtnHTML + nextBtnHTML);

        // Add click listener to changeQuestion Button
        const that = this;
        $('.changeQuestion').click(function() {

            // Change question
            switch ($(this).attr('data-action')) {
                case 'previous':
                    if(that.currentQuestion > 0) {
                        that.changeQuestion(Session.PREVIOUS_QUESTION);

                        // Unbind the click action to avoid answer spamming! (IMPORTANT)
                        $(this).unbind();
                    }
                    break;
                case 'next':
                    if(that.currentQuestion < that.questions.length - 1) {
                        that.changeQuestion(Session.NEXT_QUESTION);

                        // Unbind the click action to avoid answer spamming! (IMPORTANT)
                        $(this).unbind();
                    }
                    break;
            }

        });
    }

    //// Get the selected answer that the user selected
    //             const selectedAnswer = $(".answer input:checked").first();
    //
    //             // Save user answer
    //             let isCorrect = that.saveAnswer();

    // Show current and total question to screen
    static showQuestionsCounter() {
        $('.questions').animate({width: '40%'}, 400).fadeTo(400, 1);
    }

    // Show results page on UI
    showResults() {

        // Count correct answers
        const risposteCorrette = this.answers.filter(x => x === true).length;

        // Generate HTML for correct answers text
        const result = '<div class="summaryLabel">Risposte corrette</div><div class="summary">' + risposteCorrette + '<span>/' + Session.questionAmount + '</span></div>';

        // Generate HTML for comment text based on vote
        let comment = '';
        if(this.vote == 30) {
            comment = 'Hai passato la prova. Congratulazioni!';
        } else if (this.vote >= 18 && this.vote < 30) {
            comment = 'Hai superato la prova';
        } else {
            comment = 'NON hai superato la prova';
        }
        comment = '<div class="mt-3 mb-5 comment">' + comment + '</div>';

        // Show HTML on UI
        $('#session').html(result + comment).fadeIn();

        // Show Home button after a delay of 1.5 seconds
        setTimeout(() => {
            $('#newSession').text('Home').click(function() {
                location.reload();
            }).fadeIn();
        }, 1500);

    }

}
