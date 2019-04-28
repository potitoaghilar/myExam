/**
 * Model of a single Answer
 */

class Answer {

    constructor(id, answer, isCorrect = false) {
        this.id = id;
        this.answer = answer;
        this.isCorrect = isCorrect;
    }

}
