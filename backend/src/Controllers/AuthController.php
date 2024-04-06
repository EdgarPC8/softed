<?php

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class AuthController
{

    /*
        Esta funcion logea y atentica el usario en el servidor
    */


    public static function signIn()
    {
        $data = json_decode(Flight::request()->getBody());
        $password=$data->password;


        

        try {

            $now = strtotime("now");
            $privateKey = $_ENV["JWT_SECRET_KEY"];
            // $payload = [
            //     'exp' => $now + $_ENV["TIME_EXP_TOKEN"],
            //     'data' => [
            //         "dni" => 1104661598,

            //     ],

            // ];
            // $token = AuthService::createToken($payload, $privateKey);
            Flight::json(["token" => $token]);
        } catch (Exception $e) {
            Flight::res()->unauthorized();
        }
        // Flight::json($password);




    }

    /**
     * Obtiene la lista de roles desde la base de datos y devuelve la respuesta como JSON.
     */
    public static function roles()
    {
        $statement = Flight::db()->prepare("SELECT id_rol, nombre FROM roles");
        $statement->execute();
        $data = $statement->fetchAll();
        $mapRole = array_map(function ($key) {
            return ["rolId" => $key["id_rol"], "rolName" => $key["nombre"]];
        }, $data);

        Flight::json($mapRole);
    }


    /**
     * Obtiene los datos del usuario autorizado a partir del token de autorización en los encabezados de la solicitud.
     * Decodifica el token JWT y devuelve los datos del usuario como respuesta JSON.
     */
    public static function getAuthorizedUserData()
    {
        $headers = getallheaders();
        $authorization = $headers["Authorization"];

        $authorizationKey = explode(" ", $authorization);
        $token = $authorizationKey[1];
        $user = JWT::decode($token, new Key($_ENV["JWT_SECRET_KEY"], 'HS256'));
        Flight::json($user);
    }

    /**
     * Registra un evento de salida en el registro de logs.
     */
    public static function logout()
    {
        $isSaved = Log::initLogger("EXIT");
        Flight::json($isSaved);
    }
}