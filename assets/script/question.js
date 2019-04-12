
class Question {

    constructor(question, answers) {
        this.question = question;
        this.answers = answers;
    }

    getCorrect() {
        return this.answers.filter(x => x.isCorrect)[0];
    }

}
