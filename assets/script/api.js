class API {

    static get baseEndpoint() { return location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : ''); }
    static get ENDPOINTS() {
        return {
            LOGIN: API.baseEndpoint + '/api/login.php',
            TITLE: API.baseEndpoint + '/api/examTitle.php',
            TIME: API.baseEndpoint + '/api/time.php',
            QUESTIONS: API.baseEndpoint + '/api/questions.php',
            SUBMIT: API.baseEndpoint + '/api/submit.php',
        };
    }

    static async login(nome, cognome, matricola) {
        return JSON.parse(await $.ajax({
            type: 'POST',
            url: this.ENDPOINTS.LOGIN,
            data: {nome, cognome, matricola},
        }));
    }

    static async getExamTitle() {
        return JSON.parse(await $.ajax({
            url: this.ENDPOINTS.TITLE,
        })).title;
    }

    static async getTime() {
        return JSON.parse(await $.ajax({
            url: this.ENDPOINTS.TIME,
        })).time;
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

}
