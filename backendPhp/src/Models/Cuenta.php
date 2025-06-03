<?php
class Cuenta extends Model {
    protected static $table = 'accounts';
    protected static $tableAttributes = [
        'username' => 'VARCHAR(255)',
        'password' => 'VARCHAR(255)',
        'userId' => 'INT', // Relación con la tabla usuario
        'rolId' => 'INT' // Relación con la tabla roles
    ];

    // Definir las claves foráneas y relaciones
    protected static $foreignKeys = [
        'users' => [
            'model' => Usuario::class,
            'foreign_key' => 'userId',
            'local_key' => 'id'
        ],
        'roles' => [
            'model' => Roles::class,
            'foreign_key' => 'rolId',
            'local_key' => 'id'
        ]
    ];
}
