<?php

/**
 * Defined classes
 */

class Response {
    public $status;
    public $message;
}

class Answer {
    public $questionId;
    public $answerId;
}

class Question {
    public $id;
    public $text;
    public $answers = [];
}