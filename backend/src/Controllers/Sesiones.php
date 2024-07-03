<?php

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class Sesiones
{

    /*
        Esta funcion logea y atentica el usario en el servidor
    */


    public static function setSession()
    {
        $username = Flight::request()->data->username;
        $password = Flight::request()->data->password;

        if ($username == "" || $password == "") {
            Flight::json(["message" => "Complete los campos", "status" => "warning"]);
            return;
        }

        $statement = Flight::db()->prepare(
            "SELECT *
        FROM " . Cuenta::$tableName . " INNER JOIN
        " . Roles::$tableName . "  ON " . Roles::$tableName . "." . Roles::$id . "  = " . Cuenta::$tableName . "." . Cuenta::$rol . " 
         INNER JOIN " . Usuario::$tableName . " ON " . Usuario::$tableName . "." . Usuario::$id . " = " . Cuenta::$tableName . "." . Cuenta::$idUsuario . " 
         WHERE " . Cuenta::$username . "  = :username      
        "
        );

        $statement->execute([":username" => $username]);
        $user = $statement->fetch(PDO::FETCH_OBJ);

        try {
            $passwordHashed = $user->password;
            $isCorrectPassword = EncryptPassword::isCorrectPassword($password, $passwordHashed);
            if (!$isCorrectPassword || empty($user)) {
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
                        "username" => $user->username,
                        "rol" => $user->rol,
                        "nameRol" => $user->name,
                        "firstName" => $user->primer_nombre,
                        "secondName" => $user->segundo_nombre,
                        "firstLastName" => $user->primer_apellido,
                        "secondLastName" => $user->segundo_apellido,
                        "genero" => $user->genero,
                    ]
                ];
                $token = AuthService::createToken($payload, $privateKey);

                $system = $_SERVER['HTTP_USER_AGENT'];
                $httpMethod = Flight::request()->getMethod();
                $endPoint = Flight::request()->url;
                $usuario=$user->primer_nombre." ".$user->segundo_nombre." ".$user->primer_apellido." ".$user->segundo_apellido;

                    SqlService::saveData("logs", (object)[
                        "httpMethod" => $httpMethod,
                        "action" => "Se logeo al Sistema",
                        "endPoint" => $endPoint,
                        "description" =>$usuario." Ingreso" ,
                        "system" => $system
                    ]);




                Flight::json(["token" => $token]);

            }

        } catch (Exception $e) {
            // Flight::res()->unauthorized();
            HTTPResponse::badRequest(["message" => "Usuario o Contraseña invalida", "status" => "error"]);
        }
        // Flight::json($user);


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