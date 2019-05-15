<?php

class Database {

    const config = [
        'host' => 'localhost',
        'port' => '3306',
        'username' => 'root',
        'password' => '',
        'database' => 'my_myexamplatform',
    ];

    static function getInstance() {
        return new mysqli(self::config['host'] . ':' . self::config['port'], self::config['username'], self::config['password'], self::config['database']);
    }

}
