<?php

require 'requires.php';

// Return the title of exam
echo json_encode([
    'title' => $examTitle,
]);