<?php
// print_r("clase AuthMiddleware");
class AuthMiddleware {
    
    public static function unauthorized() {
        Flight::halt(401, json_encode(
            [
                "error" => "Unauthorized",
                "status" => "error",
                "code" => 401,
            ]
        ));
        // echo "hola";
    }

    public static function isAuthorized() {
        $isAuth = isset(Session::getSession()["session"]);
        if (!$isAuth) self::unauthorized();
    }    
}

?>