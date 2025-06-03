<?php

class Roles extends Model {
    protected static $table = 'roles';
    protected static $tableAttributes = [
        'name' => 'VARCHAR(255)'
    ];
    // public function cuentas() {
    //     return $this->hasMany(Cuenta::class, 'rol'); // Clave foránea en cuenta
    // }
}
