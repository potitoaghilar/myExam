<?php

// TODO

function generateRandomString($length = 10) {
    $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $charactersLength = strlen($characters);
    $randomString = '';
    for ($i = 0; $i < $length; $i++) {
        $randomString .= $characters[rand(0, $charactersLength - 1)];
    }
    return $randomString;
}

// Session cookie
setcookie('session-id', generateRandomString(), 0, "/");

// Error
/*echo json_encode([
    'error' => 'L\'esame è terminato',
    'status' => false,
]);*/

// Success
echo json_encode([
    'status' => true,
]);