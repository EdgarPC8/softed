<?php

class Pagos extends Model {
    protected static $table = 'pagos';
    protected static $tableAttributes = [
        'idReserva' => 'INTEGER',
        'metodoPago' => 'VARCHAR(255)',
        'monto' => 'VARCHAR(255)',
        'fecha' => 'DATE'
    ];
 
}
