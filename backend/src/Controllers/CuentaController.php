<?php


class CuentaController
{

    public static function createCuenta(){

        $data = Flight::request()->data;

        // Flight::json(SqlService::selectData(Nadador::$tableName,[],[],null,null));

        $passwordEncrypt=EncryptPassword::encrypt($data->password);


        $objeto=(object)[
            Cuenta::$username=>$data->username,
            Cuenta::$password=>$passwordEncrypt,
            Cuenta::$rol=>$data->rol,
        ];



        $data->password=$passwordEncrypt;

        // SqlService::saveData(Tiempos::$tableName,$data);

        Flight::json(SqlService::saveData(Cuenta::$tableName,$objeto));

    }

}