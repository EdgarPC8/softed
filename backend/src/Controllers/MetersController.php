<?php

class MetersController
{
    public static function getMeters()
    {

       $data = array_map(function($row) {
        return [
            "id" => $row["id"],
            "metros" => $row["metros"]
        ];

       }, SqlService::selectData(Meters::$tableName)) ;
        Flight::json($data);
    }
    public static function addMeters()
    {
        $data = json_decode(Flight::request()->getBody());
        if (SqlService::saveData(Meters::$tableName, $data)) {
            # code...
            Flight::json(["message" => "Metros agregado"]);
        }

    }
    public static function updateMeters($id)
    {
        $body = json_decode(Flight::request()->getBody());



        if (SqlService::editData(Meters::$tableName, $body, (object) ["id" => $id])) {

            Flight::json(["message" => "Metros actualizados"]);
        }

    }

    public static function deleteMeters($id)
    {

        $where = (object) [
            "id" => $id,
        ];
        if (SqlService::deleteData(Meters::$tableName, $where)) {
            Flight::json(["message" => "Institutcón eliminada"]);

        }

    }
}
