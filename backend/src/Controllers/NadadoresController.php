<?php


class NadadoresController
{

    /*
        Esta funcion logea y atentica el usario en el servidor
    */


    public static function getAllNadadores(){
        Flight::json(SqlService::selectData(Nadador::$tableName,[],[],null,null));
        // Flight::json("dededed");
    }

}