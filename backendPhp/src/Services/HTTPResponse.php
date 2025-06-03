<?php

class HTTPResponse
{
    public static function unauthorized()
    {
        Flight::halt(
            401,
            json_encode(
                [
                    "message" => "Access Unauthorized",
                    "mensaje" => "Acceso no autorizado",
                    "code" => 401,
                ]
            )
        );
    }

    public static function forbidden()
    {
        Flight::halt(
            403,
            json_encode(
                [
                    "message" => "Access Forbidden",
                    "mensaje" => "Acceso Prohibido",
                    "code" => 403,
                ]
            )
        );

    }

    public static function badRequest(array $data)
    {
        $json = json_encode(array_merge(["code" => 400], $data));
        Flight::halt(400, $json);
    }

    public static function conflictRequest(array $data)
    {
        $json = json_encode(array_merge(["code" => 409], $data));
        Flight::halt(409, $json);

    }

    public static function errorRequest(array $data)
    {
        $json = json_encode(array_merge(["code" => 500], $data));
        Flight::halt(500, $json);

    }
}