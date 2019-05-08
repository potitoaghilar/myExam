
/***
 * The main class Session
 */
class Session {

    static get PREVIOUS_QUESTION() { return -1; }
    static get NEXT_QUESTION() { return 1; }

    constructor(nome, cognome, matricola) {

        // Set the main fields of the object Session we are creating in this moment
        this.questions = [];
        this.currentQuestion = -1;
        this.answers = [];
        this.vote = 0;

        // Set user profile
        this.nome = nome;
        this.cognome = cognome;
        this.matricola = matricola;
		

        // Set timer
        this.setTimer();
    }

    async setTimer() {
        // The timer fields are useful for remaining time tracking
        this.timer = undefined;
        this.time = await API.getTime(this.matricola);
    }

    async login() {
        const response = await API.login(this.nome, this.cognome, this.matricola);
        if (response.status == 'success') {

            // Save already given answers
            this.answers = response.message;

            // Fetch the questions from external API
            this.fetchQuestions();

        } else {

            $('#error').modal('show').find('.modal-body').text(response.message);
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
        questions.forEach(question => this.createQuestion(question));

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

        // Mix answers order
        answers = shuffle(answers);

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
            //this.questions = shuffle(this.questions);

            // Show question count
            Session.showQuestionsCounter();

            // Show first question
            this.changeQuestion(Session.NEXT_QUESTION);

            // Show timer
            $('#time').fadeIn();
			$('#user_details').fadeIn();

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

                // Reset timer to 0
                this.time = 0;
                this.updateTimerUI();

                //this.closeSession();
				this.forceCloseSession();
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
    async closeSession() {
		var status="normal";
		// Close exam request
        const result = await API.submit(this.matricola,status);
		if(result.status=='error'){
			$('#error').modal('show').find('.modal-body').text("Non hai risposta a "+result.message+ "domande");
            return;
		}
		else{
        // Remove the timer
        clearInterval(this.timer);

        // Hide session page
        $('#session').fadeOut();
		}

        // Show results page
        setTimeout(() => {
            this.showResults(result.message);
        }, 400);
			

    }
	
	//force close session
	async forceCloseSession() {

		// Close exam request
        const result = await API.submitForced(this.matricola);
		
        // Remove the timer
        clearInterval(this.timer);

        // Hide session page
        $('#session').fadeOut();
		
        // Show results page
        setTimeout(() => {
            this.showResults(result.message);
        }, 400);
			

    }

    // Update time UI: minutes and seconds
    updateTimerUI() {
        $('.mins').text(pad(Math.floor(this.time / 60), 2));
        $('.secs').text(pad(Math.floor(this.time % 60), 2));
    }

    // Save the answer provided from user
    saveAnswer(answerId) {

        const questionId = parseInt(this.questions[this.currentQuestion].id);

        // Remove old given answer for this question
        this.answers = this.answers.filter(x => x.questionId != questionId);

        // Save result in local
        this.answers.push({questionId, answerId: parseInt(answerId)});

        // Send answer to server
        API.postAnswer(this.matricola, questionId, answerId);
		
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
            submitBtnHTML = '<button id="closeSession" type="button" data-action="submit" class="btn btn-danger mt-3 ml-3">Chiudi esame</button>';
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
		
        // Add click listener to close exam
        $('#closeSession').click(() => this.closeSession());

    }

    // Show current and total question to screen
    static showQuestionsCounter() {
        $('.questions').animate({width: '40%'}, 400).fadeTo(400, 1);
    }

    // Show results page on UI
    showResults(apiResult) {

        // Generate HTML for correct answers text
        const result = '<div class="summaryLabel">Esame concluso</div><div class="summary">' + apiResult + '</span></div>';

        // Show HTML on UI
        $('#session').html(result).fadeIn();

        // Show Home button after a delay of 1.5 seconds
        setTimeout(() => {
            $('#newSession').text('Home').click(function() {
                location.reload();
            }).fadeIn();
        }, 1500);

    }


}
