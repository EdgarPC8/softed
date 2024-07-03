<?php


class NadadoresController
{

    /*
        Esta funcion logea y atentica el usario en el servidor
    */


    public static function getAllNadadores()
    {
        Flight::json(SqlService::selectData(Nadador::$tableName, [], ["grupo"=>1], null, "nadador"));
        // Flight::json("dededed");
    }

    public static function addSwimmer()
    {



        $body = json_decode(Flight::request()->getBody());


        $data = (object) [
            "cedula" => $body->cedula,
            "nadador" => "$body->nombres $body->apellidos",
            "nombres" => "$body->nombres",
            "apellidos" => "$body->apellidos",
            "fecha_nacimiento" => $body->fecha_nacimiento,
            "genero" => $body->genero,
            "grupo" => $body->grupo

        ];
        SqlService::saveData(Nadador::$tableName, $data);
        Flight::json(["message" => "Nadador Agregado"]);
        //code


        // if (SqlService::saveData(Nadador::$tableName, $data)) {
        //     # code...
        // }


    }


    public static function deleteSwimmer($dni)
    {

        if (SqlService::deleteData(Nadador::$tableName, (object) ["cedula" => $dni])) {
            Flight::json(["message" => "Elimando con éxito"]);
        }

    }

    public static function updateSwimmer($dni)
    {



        $body = json_decode(Flight::request()->getBody());


        $data = (object) [
            "cedula" => $body->cedula,
            "nadador" => "$body->nombres $body->apellidos",
            "nombres" => "$body->nombres",
            "apellidos" => "$body->apellidos",
            "fecha_nacimiento" => $body->fecha_nacimiento,
            "genero" => $body->genero,
            "grupo" => $body->grupo

        ];
        SqlService::editData(Nadador::$tableName, $data, (object) ["cedula" => $dni]);
        Flight::json(["message" => "Actualizado Agregado"]);




    }



    public static function getOneSwimmer($dni)
    {
        $where = [
            "cedula" => $dni,
        ];
        $columns = ["cedula", "nombres", "apellidos", "grupo", "fecha_nacimiento", "genero"];


        $data = array_map(function ($row) {
            // var_dump($data);
            return [
                "nombres" => $row["nombres"],
                "apellidos" => $row["apellidos"],
                "cedula" => $row["cedula"],
                "fecha_nacimiento" => $row["fecha_nacimiento"],
                "genero" => $row["genero"],
                "grupo" => $row["grupo"]
            ];

        }, SqlService::selectData(Nadador::$tableName, $columns, $where));

        Flight::json($data);




    }

}