<?php

class Cliente extends Model {
    protected static $table = 'cliente';
    protected static $tableAttributes = [
        'typeDocument' => 'VARCHAR(100)',
        'document' => 'VARCHAR(20)',
        'firstName' => 'VARCHAR(255)',
        'secondName' => 'VARCHAR(255)',
        'firstLastName' => 'VARCHAR(255)',
        'secondLastName' => 'VARCHAR(255)',
        'email' => 'VARCHAR(255)',
        'phone' => 'VARCHAR(30)',
    ];
 
}
