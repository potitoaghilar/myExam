<?php

/**
 * Defined classes
 */

class Response {
    public $status;
    public $message;
}

class UserAnswer {
    public $questionId;
    public $answerId;
}

class Answer{
    public $id;
    public $text;
	public $corrected;
}

class Question {
    public $id;
    public $text;
    public $answers = [];

    public function getCorrectAnswer() {
        foreach($this->answers as $answer) {
            if($answer->corrected == 1) {
                return $answer;
            }
        }
        return null;
    }
}