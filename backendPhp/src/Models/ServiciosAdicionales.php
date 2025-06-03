<?php

class ServiciosAdicionales extends Model {
    protected static $table = 'serviciosAdicionales';
    protected static $tableAttributes = [
        'name' => 'VARCHAR(255)',
        'precio' => 'VARCHAR(255)',
        'descripcion' => 'TEXT'
    ];
 
}
