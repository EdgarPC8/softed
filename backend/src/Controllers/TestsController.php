<?php

class TestsController
{
    public static function addTest()
    {
        $data = json_decode(Flight::request()->getBody());
        if (SqlService::saveData(Tests::$tableName, $data)) {
            # code...
            Flight::json(["message" => "Prueba agregada"]);
        }


    }

    public static function updateTest($id)
    {

        $body = json_decode(Flight::request()->getBody());
        if (SqlService::editData(Tests::$tableName, $body, (object) ["id" => $id])) {
            Flight::json(["message" => "Prueba actualizada"]);
        }
    }

    public static function getTests()
    {
        $data = array_map(function ($row) {
            return [
                "id" => $row["id"],
                "nombre" => $row["nombre"]
            ];

        }, SqlService::selectData(Tests::$tableName));
        Flight::json($data);

    }

    public static function deleteTest($id)
    {
        $where = (object) [
            "id" => $id,
        ];
        if (SqlService::deleteData(Tests::$tableName, $where)) {
            Flight::json(["message" => "Prueba eliminada"]);

        }



    }
}
