class API {

    static get baseEndpoint() { return location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : ''); }
    static get ENDPOINTS() {
        return {
            LOGIN: API.baseEndpoint + '/api/login.php',
            TITLE: API.baseEndpoint + '/api/examTitle.php',
            TIME: API.baseEndpoint + '/api/time.php?matricola=',
            QUESTIONS: API.baseEndpoint + '/api/questions.php',
            SUBMIT: API.baseEndpoint + '/api/submit.php',
			ANSWER: API.baseEndpoint + '/api/submit.php',
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

    static async submit(answers) {
        return await $.ajax({
            url: this.ENDPOINTS.SUBMIT,
        });
    }
	//invio risposta
	static async postAnswer(matricola,answer_id,question_id) {
        return await $.ajax({
            type: 'POST',
            url: this.ENDPOINTS.ANSWER,
            data: {matricola, answer_id, question_id},
        });
    }

}
