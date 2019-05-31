<?php

// Block connection form other clients: Allown only one IP
if($_SERVER['REMOTE_ADDR'] != '::1') {
    header('HTTP/1.0 403 Forbidden');
    die('Accesso negato!');
}
