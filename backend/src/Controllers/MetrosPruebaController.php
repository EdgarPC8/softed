<?php


class MetrosPruebaController
{

    public static function getMetros(){
        Flight::json(SqlService::selectData(Metros::$tableName,["metros AS name","id AS value"],[],null,null));
    }
    public static function getPruebas(){
        Flight::json(SqlService::selectData(Pruebas::$tableName,["nombre AS name","id AS value"],[],null,null));
    }
    

}



