<?php

class UserFunctions {

    


    public static function getNameTable($int)
    {
        $tableName = match ($int) 
        {
            2 => "doctor",
            3 => "enfermero",
            4,5 => "usuario",
            default => "null"
        }; 
        return $tableName;
    }
    
    
}


