

class API {

    static get baseEndpoint() { return 'http://192.168.43.103:8888'; }
    static get ENDPOINTS() {
        return {
            LOGIN: API.baseEndpoint + '/api/login.php',
            TITLE: API.baseEndpoint + '/api/examTitle.php',
            TIME: API.baseEndpoint + '/api/time.php',
            QUESTIONS: API.baseEndpoint + '/api/questions.php',
            SUBMIT: API.baseEndpoint + '/api/submit.php',
        };
    }

    static async login() {
        // TODO
    }

    static async getExamTitle() {
        return JSON.parse(await $.ajax({
            url: this.ENDPOINTS.TITLE,
        })).title;
    }

    static async getTime() {
        return await $.ajax({
            url: this.ENDPOINTS.TIME,
        });
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
