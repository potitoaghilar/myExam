<?php

// Block connection form other clients: localhost only allowed
if($_SERVER['REMOTE_ADDR'] != '127.0.0.1') {
    header('HTTP/1.0 403 Forbidden');
    die('Accesso negato!');
}
