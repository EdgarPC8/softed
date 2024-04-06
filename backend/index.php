<?php

error_reporting(E_ALL);
ini_set('display_errors', 'On');


require 'src/Middlewares/Cors.php';
require 'vendor/autoload.php';

# Se carga el fichero .env. Para obtener las variables de entorno
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();
$DB_NAME = $_ENV["DB_NAME"];
$DB_HOST = $_ENV["DB_HOST"];
$DB_USER = $_ENV["DB_USER"];

Flight::path('src/Models');
Flight::path('src/Model');
Flight::path('src/Controllers');
Flight::path('src/Middlewares');
Flight::path('src/Services');
Flight::register('db', 'PDO', ["mysql:host=$DB_HOST;dbname=$DB_NAME", "$DB_USER", '']);
Flight::register('res', 'HTTPResponse');



// Flight::register('res', 'HTTPResponse');

// header('Content-Type: application/json');
Flight::route('GET /dataBase', function () {
    Tables::delete();
    Tables::create();
    Tables::importFromJson('./src/BD/backup.json');
});
Flight::route('GET /getSession', function () {
    // AuthMiddleware::isAuthorized();
    Sesiones::getAuthorizedUserData();
});
Flight::route('POST /login', function () {
    Sesiones::setSession();
});
Flight::route('POST /createCuenta', function () {
    CuentaController::createCuenta();
});


Flight::route('GET /exportBD', function () {
    Tables::export();
});
Flight::route('GET /closeSession', function () {
    Sesiones::closeSession();
});

Flight::route('GET /getAllNadadores', function () {
    // AuthMiddleware::isAuthorized();
    NadadoresController::getAllNadadores();
});
Flight::route('GET /getTiemposByCI/@data', function ($data) {
    TiemposController::getTiemposByCI($data);
});
Flight::route('GET /getTiemposByMetrosPrueba/@cedula/@metros/@prueba', function ($cedula,$metros,$prueba) {
    TiemposController::getTiemposByMetrosPrueba($cedula,$metros,$prueba);
});
Flight::route('GET /getAllTiemposRecordsById/@cedula', function ($cedula) {
    TiemposController::getAllTiemposRecordsById($cedula);
});
Flight::route('GET /getPruebas', function () {
    MetrosPruebaController::getPruebas();
});
Flight::route('GET /getMetros', function () {
    MetrosPruebaController::getMetros();
});





Flight::route('POST /getSelects', function () {
    GetSelects::getSelects();
});
Flight::route('POST /saveData', function () {
    Data::saveData();
});
Flight::route('POST /editData', function () {
    Data::editData();
});
Flight::route('POST /getTable', function () {
    Tables::getTable();
});
Flight::route('POST /deleteData', function () {
    Data::deleteData();
});
Flight::route('POST /ejecutar', function () {
    Comands::ejecutar();
});
Flight::route('GET /createBD', function () {
    Comands::createBD();
});
Flight::route('POST /getEntidadCompetencia', function () {
    Competencia::getEntidadCompetencia();
});
Flight::route('POST /getCompetenciaTiempos', function () {
    Competencia::getCompetenciaTiempos();
});
Flight::route('POST /getResultados', function () {
    Competencia::getResultados();
});
Flight::route('POST /administrarCompetencia', function () {
    Competencia::administrarCompetencia();
});
Flight::route('POST /getRecords', function () {
    Info::getRecords();
});

// Flight::route('GET /getSession', function () {
//     Sesiones::getSession();
// });


Flight::start();