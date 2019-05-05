<?php

class Database {

    const config = [
        'host' => 'localhost',
        'port' => '3306',
        'username' => 'root',
        'password' => 'Poti1997$',
        'database' => 'esame',
    ];

    /*const config = [
        'host' => 'localhost',
        'port' => '8889',
        'username' => 'root',
        'password' => 'root',
        'database' => 'esame',
    ];*/

    static function getInstance() {
        return new mysqli(self::config['host'] . ':' . self::config['port'], self::config['username'], self::config['password'], self::config['database']);
    }

}