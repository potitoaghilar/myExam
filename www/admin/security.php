<?php

// Block connection form other clients: localhost only allowed
if($_SERVER['REMOTE_ADDR'] != '151.50.24.190') {
    header('HTTP/1.0 403 Forbidden');
    die('Accesso negato!');
}
