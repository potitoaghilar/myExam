<?php

class Database {

    const config = [
        'host' => 'localhost',
        'port' => '8889',
        'username' => 'root',
        'password' => 'root',
        'database' => 'esame',
    ];

    static function getInstance() {
        return new mysqli(self::config['host'] . ':' . self::config['port'], self::config['username'], self::config['password'], self::config['database']);
    }

}