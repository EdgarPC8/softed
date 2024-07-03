<?php

error_reporting(E_ALL);
ini_set('display_errors', 'On');


require 'src/Middlewares/Cors.php';
// require 'vendor/autoload.php';
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

// Middleware para registrar la actividad
Flight::before('start', function(&$params, &$output) {
    LoggerMiddleware::logs(Flight::request(), Flight::response(), function(){});
    // $request = Flight::request();
    // var_dump($request->url); // Verifica qué métodos están disponibles en $request
    // LoggerMiddleware::logs($request, Flight::response(), function(){});
});



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

Flight::route('POST /backUp', function () {
    ProgrammerController::saveBackUp();
});

Flight::route('POST /images', function () {
    ProgrammerController::addImages();
});

Flight::route('DELETE /images/@name', function($name) {
    ProgrammerController::deleteImage($name);
});

Flight::route('GET /images', function () {
    ProgrammerController::getListImages();
});

Flight::route('POST /createCuenta', function () {
    CuentaController::createCuenta();
});

Flight::route('POST /users', function () {
    UserController::addUser();
});

Flight::route('GET /users', function () {
    UserController::getUsers();
});

Flight::route('GET /users/@dni', function ($dni) {
    UserController::getOneUser($dni);
});

Flight::route('PUT /users/@dni', function ($dni) {
    UserController::updateUser($dni);
});

Flight::route('DELETE /users/@dni', function ($dni) {
    UserController::deleteUser($dni);
});


Flight::route("POST /users/photo", function () {
    UserController::addPhoto();
});


Flight::route("PUT /users/photo/@dni", function ($dni) {
    UserController::updatePhoto($dni);
    // var_dump("hola");
});


Flight::route("GET /institution", function () {
    // AuthMiddleware::isAuthorized();
    InstitutionController::getInstitutions();
});
Flight::route("POST /swimmer", function () {
    NadadoresController::addSwimmer();
});

Flight::route("PUT /swimmer/@dni", function ($dni) {
    NadadoresController::updateSwimmer($dni);
});

Flight::route("DELETE /swimmer/@dni", function ($dni) {
    NadadoresController::deleteSwimmer($dni);

});

Flight::route("GET /swimmer/@dni", function ($dni) {
    NadadoresController::getOneSwimmer($dni);
});

Flight::route("DELETE /institution/@id", function ($id) {
    InstitutionController::deleteInstitution($id);
});

Flight::route("PUT /institution/@id", function ($id) {
    InstitutionController::updateInstitution($id);
});

Flight::route("POST /institution", function () {
    InstitutionController::addInstitution();
});



Flight::route("GET /tests", function () {
    TestsController::getTests();

});

Flight::route("POST /tests", function () {
    TestsController::addTest();

});


Flight::route("PUT /tests/@id", function ($id) {
    TestsController::updateTest($id);
});


Flight::route("DELETE /tests/@id", function ($id) {
    TestsController::deleteTest($id);
});


Flight::route("GET /meters", function () {
    MetersController::getMeters();

});
Flight::route("GET /getCompetenciasData", function () {
    Competencia::getCompetenciasData();

});

Flight::route("POST /meters", function () {
    MetersController::addMeters();
});
Flight::route("POST /addCompetencia", function () {
    Competencia::addCompetencia();
});
Flight::route("POST /addSerie", function () {
    SeriesController::addSerie();
});

Flight::route("POST /createCompetencia", function () {
    Competencia::createCompetencia();
});


Flight::route("PUT /meters/@id", function ($id) {
    MetersController::updateMeters($id);
});

Flight::route("PUT /updateTimeCompetencia/@id", function ($id) {
    Competencia::updateTimeCompetencia($id);
});


Flight::route("DELETE /meters/@id", function ($id) {
    MetersController::deleteMeters($id);
});
Flight::route("DELETE /serie/@id", function ($id) {
    SeriesController::removeSerie($id);
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
Flight::route('GET /getTiemposByMetrosPrueba/@cedula/@metros/@prueba', function ($cedula, $metros, $prueba) {
    TiemposController::getTiemposByMetrosPrueba($cedula, $metros, $prueba);
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
Flight::route('GET /getInfo/@cedula', function ($cedula) {
    Info::getInfo($cedula);
});



// -----------------------------------------------------------


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
Flight::route('GET /ejecutar', function () {
    Comands::ejecutar();
});
Flight::route('GET /createBD', function () {
    Comands::createBD();
});
Flight::route('GET /getEntidadCompetencia', function () {
    Competencia::getEntidadCompetencia();
});
Flight::route('GET /getCompetenciaTiempos', function () {
    Competencia::getCompetenciaTiempos();
});
Flight::route('GET /getResultados', function () {
    Competencia::getResultados();
});
Flight::route('GET /administrarCompetencia', function () {
    Competencia::administrarCompetencia();
});
Flight::route('POST /getRecords', function () {
    Info::getRecords();
});

// Flight::route('GET /getSession', function () {
//     Sesiones::getSession();
// });


Flight::start();