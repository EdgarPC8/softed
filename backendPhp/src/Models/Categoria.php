<?php

class Categoria extends Model {
    protected static $table = 'categoria';
    protected static $tableAttributes = [
        'name' => 'VARCHAR(255)',
        'description' => 'VARCHAR(255)',
    ];
 
}
