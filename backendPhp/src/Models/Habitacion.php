<?php

class Habitacion extends Model {
    protected static $table = 'habitacion';
    protected static $tableAttributes = [
        'name' => 'VARCHAR(255)',
        'idCategoria' => 'INTEGER',
        'piso' => 'INTEGER',
        'estado' => 'VARCHAR(255)',
        'totalPagado' => 'VARCHAR(255)',
    ];
 
}
