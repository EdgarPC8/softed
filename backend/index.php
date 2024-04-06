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

Flight::path('src/Model');
Flight::path('src/Middlewares');
Flight::path('src/Controllers');
Flight::path('src/Services');
Flight::register('db', 'PDO', ["mysql:host=$DB_HOST;dbname=$DB_NAME", "$DB_USER", '']);
// Flight::register('res', 'HTTPResponse');

// header('Content-Type: application/json');

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
Flight::route('POST /createBD', function () {
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

Flight::route('POST /login', function () {
    Sesiones::setSession();
});
Flight::route('GET /getSession', function () {
    Sesiones::getSession();
});
Flight::route('GET /closeSession', function () {
    Sesiones::closeSession();
});

Flight::start();