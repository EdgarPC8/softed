
<?php

error_reporting(E_ALL);
ini_set('display_errors', 'On');

require_once 'src/Middlewares/Cors.php';
require_once 'vendor/autoload.php';
require_once 'src/Routes/authRoutes.php';
require_once 'src/Routes/comandsRoutes.php';
require_once 'src/Routes/userRoutes.php';
require_once 'src/Routes/hotelRoutes.php';
require_once 'src/Routes/nivelHotelRoutes.php';

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
Flight::path('src/Routes');
Flight::register('db', 'PDO', ["mysql:host=$DB_HOST;dbname=$DB_NAME", "$DB_USER", '']);
Flight::register('res', 'HTTPResponse');

// Middleware para registrar la actividad
Flight::before('start', function(&$params, &$output) {
    LoggerMiddleware::logs(Flight::request(), Flight::response(), function(){});
    // $request = Flight::request();
    // var_dump($request->url); // Verifica qué métodos están disponibles en $request
    // LoggerMiddleware::logs($request, Flight::response(), function(){});
});



Flight::start();