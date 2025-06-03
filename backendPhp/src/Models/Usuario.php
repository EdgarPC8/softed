<?php

class Usuario extends Model {
    protected static $table = 'users';
    protected static $tableAttributes = [
        'ci' => 'VARCHAR(255) UNIQUE',
        'firstName' => 'VARCHAR(255)',
        'secondName' => 'VARCHAR(255)',
        'firstLastName' => 'VARCHAR(255)',
        'secondLastName' => 'VARCHAR(255)',
        'gender' => 'VARCHAR(255)',
        'birthay' => 'DATE'
    ];
 
}
