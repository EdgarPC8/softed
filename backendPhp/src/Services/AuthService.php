<?php
use Firebase\JWT\JWT;


class AuthService
{
    public static function createToken(array $payload, string $privateKey)
    {
        $jwt = JWT::encode($payload, $privateKey, 'HS256');
        return $jwt;

    }


    public static function getHeaderToken()
    {
        $headers = getallheaders();
        $authorization = $headers["Authorization"] ?? null;
        if (is_null($authorization)) {
            return $authorization;
        }
        $authorizationKey = explode(" ", $authorization);
        $token = $authorizationKey[1];
        return $token;

    }

    





}