<?php


class Logs extends Model {
    protected static $table = 'logs';
    protected static $tableAttributes = [
        'httpMethod'=> 'TEXT', 
        'action'=> 'TEXT', 
        'endPoint'=> 'TEXT', 
        'description'=> 'TEXT', 
        'system'=> 'TEXT', 
        'date'=> 'DATE DEFAULT CURRENT_TIMESTAMP'
    ];
}

