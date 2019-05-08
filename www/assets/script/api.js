class API {

    static get baseEndpoint() { return location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : ''); }
    static get ENDPOINTS() {
        return {
            LOGIN: API.baseEndpoint + '/api/login.php',
            TITLE: API.baseEndpoint + '/api/examTitle.php',
            TIME: API.baseEndpoint + '/api/time.php?matricola=',
            QUESTIONS: API.baseEndpoint + '/api/questions.php',
            SUBMIT: API.baseEndpoint + '/api/submit.php',
			FORCEDSUBMIT: API.baseEndpoint + '/api/forcedSubmit.php',
            ANSWER: API.baseEndpoint + '/api/publish.php',
        };
    }

    static async login(nome, cognome, matricola) {
        return await $.ajax({
            type: 'POST',
            url: this.ENDPOINTS.LOGIN,
            data: {nome, cognome, matricola},
        });
    }

    static async getExamTitle() {
        return (await $.ajax({
            url: this.ENDPOINTS.TITLE,
        })).title;
    }

    static async getTime(matricola) {
        const time = (await $.ajax({
            url: this.ENDPOINTS.TIME + matricola,
        })).time;
        return time > 0 ? time : 0;
    }

    static async getQuestions() {
        return await $.ajax({
            url: this.ENDPOINTS.QUESTIONS,
        });
    }
	
	static async submit(matricola) {
        return await $.ajax({
            type: 'POST',
            url: this.ENDPOINTS.SUBMIT,
            data: {matricola},
        });
    }
		static async submitForced(matricola) {
        return await $.ajax({
            type: 'POST',
            url: this.ENDPOINTS.FORCEDSUBMIT,
            data: {matricola},
        });
    }
	

	static async postAnswer(matricola, question_id, answer_id) {
        return await $.ajax({
            type: 'POST',
            url: this.ENDPOINTS.ANSWER,
            data: {matricola, question_id, answer_id},
        });
    }

}
