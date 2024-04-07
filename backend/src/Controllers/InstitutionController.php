<?php


class InstitutionController
{
    public static function addInstitution()
    {
        $data = json_decode(Flight::request()->getBody());
        if (SqlService::saveData(Institution::$tableName, $data)) {
            # code...
            Flight::json(["message" => "Institucion agregada"]);
        }


    }

    public static function updateInstitution($id)
    {

        $body = json_decode(Flight::request()->getBody());
        SqlService::editData(Institution::$tableName, $body, (object) ["id" => $id]);
        Flight::json(["message" => "Institución actualizada"]);
    }

    public static function getInstitutions()
    {
        Flight::json(SqlService::selectData(Institution::$tableName));

    }

    public static function deleteInstitution($id)
    {
        $where = (object) [
            "id" => $id,
        ];
        if (SqlService::deleteData(Institution::$tableName, $where)) {
            Flight::json(["message" => "Institutcón eliminada"]);

        }



    }
}