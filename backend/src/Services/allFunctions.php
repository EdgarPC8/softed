<?php
class allFunctions
{
    public static function addElementoToArray(&$array, $key, $value = "")
    {
        $json = json_decode(Flight::request()->getBody());
        $valor = "";
        if (!isset($array[$key])) {
            if (property_exists($json, $key)) {
                $array[$key] = $json->{$key};
            } else {
                $array[$key] = $valor;
            }
        } else {
            $array[$key] = $value;
        }
        for ($i = 1; $i <= 22; $i++) {
            if (property_exists($json, $key . $i)) {
                $valor .= $json->{$key . $i} . " ";
                $array[$key] = $valor;
            }
        }
    }
    public static function removeElementoToArray(&$array, $key)
    {
        if (isset($array[$key])) {
            unset($array[$key]);
        }
    }
   
    
}