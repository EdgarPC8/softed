
<?php
class Session {
    
    
    private static $sessionStarted = false;

    private static function startSession() {
        if (!self::$sessionStarted) {
            session_start();
            self::$sessionStarted = true;
        }
    }

    public static function setSession($dni) {

        self::startSession();
        $_SESSION["session"] = [
            "dni" => $dni
        ];
    }
    

    public static function getSession() {
        self::startSession();
        return $_SESSION;
    }

    public static function closeSession() {
        session_unset();
        session_destroy();
    }
}

