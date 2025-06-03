<?php
Flight::route('GET /comands/createBD', function () {
    Usuario::sync(true); // Esto crea la tabla Usuario
    Roles::sync(true); // Esto crea la tabla Roles
    Cuenta::sync(true); // Esto crea la tabla Cuenta
    Logs::sync(true); // Esto crea la tabla Logs
    Hotel::sync(true); // Esto crea la tabla Logs
    Categoria::sync(true); 
    Cliente::sync(true); 
    Cuenta::sync(true); 
    Habitacion::sync(true); 
    Pagos::sync(true); 
    Reservas::sync(true); 
    ServicioCliente::sync(true); 
    ServiciosAdicionales::sync(true); 
    Nivel::sync(true); 
});
Flight::route('GET /comands/importJsonBD', function () {
    ComandsController::importFromJson('./src/BD/backup.json');
});
Flight::route('GET /comands/reloadJsonBD', function () {
    Usuario::sync(true); // Esto crea la tabla Usuario
    Roles::sync(true); // Esto crea la tabla Roles
    Cuenta::sync(true); // Esto crea la tabla Cuenta
    Logs::sync(true); // Esto crea la tabla Logs
    Hotel::sync(true); // Esto crea la tabla Logs
    Categoria::sync(true); 
    Cliente::sync(true); 
    Cuenta::sync(true); 
    Habitacion::sync(true); 
    Pagos::sync(true); 
    Reservas::sync(true); 
    ServicioCliente::sync(true); 
    ServiciosAdicionales::sync(true); 
    Nivel::sync(true); 
    ComandsController::importFromJson('./src/BD/backup.json');
});
Flight::route('GET /comands/exportBD', function () {
    ComandsController::export();
});
Flight::route('POST /comands/json', function () {
   ComandsController::importJson();
});
Flight::route('GET /comands/exportJsonBDToClient', function(){
    ComandsController::exportToClient(); // Llamar a la función exportadora
});
