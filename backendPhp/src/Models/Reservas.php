<?php

class Reservas extends Model {
    protected static $table = 'reservas';
    protected static $tableAttributes = [
        'name' => 'VARCHAR(255)',
        'idCliente' => 'INTEGER',
        'idHabitacion' => 'INTEGER',
        'fechaInicio' => 'DATE',
        'fechaFin' => 'DATE',
        'estado' => 'VARCHAR(255)',
        'totalPagado' => 'VARCHAR(255)',
    ];
 
}
