<?php

class EncryptPassword {
    
    private static $passwordHashed;



    
    public static function encrypt(string $password) {
        self::$passwordHashed = password_hash($password, PASSWORD_DEFAULT);
        return self::$passwordHashed; 
    }

    public static function isCorrectPassword(string $password, string $passwordHashed) {
        $isCorrectPassword =  password_verify($password, $passwordHashed) ? true : false;
        return $isCorrectPassword;
    }
    


    
}