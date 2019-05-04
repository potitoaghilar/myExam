
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

        // Set timer
        this.setTimer();
    }

    async setTimer() {
        // The timer fields are useful for remaining time tracking
        this.timer = undefined;
        this.time = await API.getTime();
    }

    async login(nome, cognome, matricola) {
        const response = await API.login(nome, cognome, matricola);
        if (response.status) {

            // Fetch the questions from external API
            this.fetchQuestions();

        } else {

            $('#error').modal('show').find('.modal-body').text(response.error);
            $('.loader').fadeOut();
            $('#login-form').delay(600).fadeIn();
            $('#exam-title').delay(600).fadeIn();
            $('.logo').removeClass('col-6').addClass('col-9');

        }
    }

    // Function used to start the session. This fetches the answers from API and start the execution of the session
    async fetchQuestions() {

        // Make an HTTP request to provided API url
        const questions = await API.getQuestions();

        // Create the questions from API response
        questions.forEach((question, index) => this.createQuestion(question));

        // Load question number in UI
        $('.questions .questions-total').text(this.questions.length);

        // Init session
        this.initSession();

    }

    createQuestion(questionData) {

        // Define a container for all generated questions
        let answers = [];

        // Create answers
        questionData.answers.forEach((answer) => answers.push(new Answer(answer.id, answer.text)));

        // Put correct and wrong answers together
        this.questions.push(new Question(questionData.id, questionData.text, answers));
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
            this.timer = this.setTimerTick();

        }, 600);

    }

    setTimerTick() {
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

    async changeQuestion(nextOrPrevious) {

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
    saveAnswer(value) {

        const questionId = parseInt(this.questions[this.currentQuestion].id);

        // Remove old given answer for this question
        this.answers = this.answers.filter(x => x.questionId != questionId);

        // Save result
        this.answers.push({questionId, answerId: parseInt(value)});

        //console.log(this.answers);
    }

    // This method updates the UI showing the question on the screen
    draw() {

        const that = this;

        // Update question number on UI
        $('.questions-done').text(this.currentQuestion + 1);

        // Generate the question HTML
        const questionHTML = '<h3>' + this.questions[this.currentQuestion].question + '</h3>';

        // Get and mix the answers for the provided question
        const answers = this.questions[this.currentQuestion].answers;

        // Get already given answer
        const givenAnswer = this.answers.find(x => x.questionId == this.questions[this.currentQuestion].id);

        // Generate the answers HTML through radio buttons
        let answersHTML = '';
        answers.forEach(answer => answersHTML += '<label class="radio answer"><input type="radio" name="answer" class="mr-2" value="' + answer.id + '" ' + (givenAnswer != undefined && givenAnswer.answerId == answer.id ? 'checked' : '') + '><span>' + answer.answer + '</span></label>');

        // Generate the next question button HTML
        const prevBtnHTML = '<button type="button" data-action="previous" class="btn btn-primary mt-3 mr-3 changeQuestion ' + (this.currentQuestion == 0 ? 'disabled' : '') + '">Precedente</button>';
        const nextBtnHTML = '<button type="button" data-action="next" class="btn btn-primary mt-3 changeQuestion ' + (this.currentQuestion == this.questions.length - 1 ? 'disabled' : '') + '">Successiva</button>';
        let submitBtnHTML = '';

        // Generate close exam button
        if(this.currentQuestion == this.questions.length - 1) {
            submitBtnHTML = '<button type="button" data-action="next" class="btn btn-danger mt-3 ml-3">Chiudi esame</button>';
        }

        // Prints all the generated HTML to screen
        $('#session').html(questionHTML + '<div class="mx-auto mt-3 w-50 text-left">' + answersHTML + '</div>' + prevBtnHTML + nextBtnHTML + submitBtnHTML);

        // Add handler to save answer given by user
        $('#session .radio.answer input').change(function() {
            that.saveAnswer($(this).val());
        });

        // Add click listener to changeQuestion Button
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
