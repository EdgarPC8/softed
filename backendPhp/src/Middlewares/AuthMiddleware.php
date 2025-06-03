<?php
// print_r("clase AuthMiddleware");


use Firebase\JWT\JWT;
use Firebase\JWT\Key;


class AuthMiddleware
{

    private static $requiredRoles = ["Doctor/a", "Enfermero/a"];

    /**
     * Valida el token de autorización presente en la solicitud.
     *
     * @return void
     */
    private static function validateToken()
    {
        try {
            $token = AuthService::getHeaderToken();
            if (is_null($token)) {
                throw new Exception("Error Processing Request");
            }

            JWT::decode($token, new Key($_ENV["JWT_SECRET_KEY"], 'HS256'));

        } catch (Exception $e) {
            Flight::res()->unauthorized();
        }
    }

    /**
     * Verifica si el usuario está autorizado mediante la validación del token de autorización.
     *
     * @param array $requiredRoles El rol requerido para acceder a la ruta.
     *                            Los roles válidos son: `Administrador`, `Doctor/a`, `Enfermero/a`,
     *                            `Moderador`, `Pasante`.
     *
     * @return void
     */
    public static function isAuthorized(array $requiredRoles = [])
    {
        self::validateToken();
        if (empty($requiredRoles)) {
            
            return;
        }

        $token = AuthService::getHeaderToken();
        $user = JWT::decode($token, new Key($_ENV["JWT_SECRET_KEY"], 'HS256'))->data;
        $roles = array_merge([$user->primaryRol], $user->secondaryRols);
        if (!array_intersect($roles, $requiredRoles)) {
            Flight::res()->forbidden();
        }
        return;



    }



}

?>