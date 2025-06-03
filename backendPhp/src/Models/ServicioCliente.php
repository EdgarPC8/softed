<?php

class ServicioCliente extends Model {
    protected static $table = 'servicioCliente';
    protected static $tableAttributes = [
        'idCliente' => 'INTEGER',
        'idServicio' => 'INTEGER',
        'Fecha' => 'DATE',
        'MontoTotal' => 'VARCHAR(255)'
    ];
 
}
