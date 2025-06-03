<?php

class Hotel extends Model {
    protected static $table = 'hotel';
    protected static $tableAttributes = [
        'name' => 'VARCHAR(255)',
        'phone' => 'VARCHAR(255)',
        'email' => 'VARCHAR(255)',
        'ubication' => 'VARCHAR(255)',
        'typeCoin' => 'VARCHAR(255)',
        'description' => 'TEXT',
    ];
 
}
