<?php

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class Sesiones
{
    public static function setSession()
    {
        $username = Flight::request()->data->username;
        $password = Flight::request()->data->password;
        if ($username == "" || $password == "") {
            Flight::json(["message" => "Complete los campos", "status" => "warning"]);
            return;
        }
        $cuenta = Cuenta::findAll(
            [
                "include"=>[
                    [
                        "model"=>Usuario::getTableName(),
                    ],
                    [
                        "model"=>Roles::getTableName()
                    ]
                ],
                "conditions"=>[
                    "username"=>$username
                ]
            ]
           
        )[0];

        try {
         
            $passwordHashed = $cuenta["password"];
            $isCorrectPassword = EncryptPassword::isCorrectPassword($password, $passwordHashed);

            if (!$isCorrectPassword || empty($cuenta)) {
                // Flight::res()->unauthorized();
                Flight::json(["message" => "Usuario o Contraseña invalida", "status" => "error"]);
                return;
            } else {
                $token = $isCorrectPassword;
                $now = strtotime("now");
                $privateKey = $_ENV["JWT_SECRET_KEY"];
                $payload = [
                    'exp' => $now + $_ENV["TIME_EXP_TOKEN"],
                    'data' => [
                        "username" => $cuenta["username"],
                        "rol" => $cuenta["rolId"],
                        "nameRol" => $cuenta["roles"]['name'],
                        "firstName" => $cuenta['users']["firstName"],
                        "secondName" => $cuenta['users']["secondName"],
                        "firstLastName" => $cuenta['users']["firstLastName"],
                        "secondLastName" => $cuenta['users']["secondLastName"],
                        "genero" => $cuenta['users']["gender"],
                        "idUsuario" => $cuenta['users']["id"],
                    ]
                ];
                $token = AuthService::createToken($payload, $privateKey);

                // $system = $_SERVER['HTTP_USER_AGENT'];
                // $httpMethod = Flight::request()->getMethod();
                // $endPoint = Flight::request()->url;
                // $usuario=$user->primer_nombre." ".$user->segundo_nombre." ".$user->primer_apellido." ".$user->segundo_apellido;

                //     SqlService::saveData("logs", (object)[
                //         "httpMethod" => $httpMethod,
                //         "action" => "Se logeo al Sistema",
                //         "endPoint" => $endPoint,
                //         "description" =>$usuario." Ingreso" ,
                //         "system" => $system
                //     ]);

                Flight::json(["token" => $token]);

            }

        } catch (Exception $e) {
            // Flight::res()->unauthorized();
            HTTPResponse::badRequest(["message" => "Usuario o Contraseña invalida", "status" => "error"]);
        }
        // Flight::json($cuenta);
    }

    public static function getAuthorizedUserData()
    {
        try {
            $authorization = getallheaders()["Authorization"] ?? null;
            $authorizationKey = explode(" ", $authorization);
            $token = $authorizationKey[1];
            $user = JWT::decode($token, new Key($_ENV["JWT_SECRET_KEY"], 'HS256'));
            Flight::json($user);
        } catch (Exception $e) {
            HTTPResponse::unauthorized();
        }

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