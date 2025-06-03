<?php

class Nivel extends Model {
    protected static $table = 'nivel';
    protected static $tableAttributes = [
        'name' => 'VARCHAR(255)',
        'orden' => 'INTEGER',
        'description' => 'TEXT'
    ];
}
