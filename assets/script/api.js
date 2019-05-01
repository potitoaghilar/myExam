

class API {

    static get baseEndpoint() { return 'http://localhost'; }
    static get ENDPOINTS() {
        return {

            LOGIN: self.baseEndpoint + '/login',

            TITLE: '/getExamTitle',

            TIME: self.baseEndpoint + '/time',
            QUESTIONS: self.baseEndpoint + '/questions',
            SUBMIT: self.baseEndpoint + '/submit',

        };
    }

    static login() {
        // TODO
    }

    static getExamTitle() {
        return "Ingegneria del Software (II modulo): Fondamenti Web";

        // TODO
    }

    static getTime() {
        return 30 * 60;

        // TODO
    }

    static async getQuestions() {
        return await $.ajax({
            url: 'https://opentdb.com/api.php?amount=10&category=18&type=multiple&difficulty=easy',
        });

        // TODO
    }

    static submit(answers) {
        return true;
        // TODO
    }

}
