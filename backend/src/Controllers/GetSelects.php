<?php

class GetSelects{
    public static function getSelects(){
        $json_data = file_get_contents("php://input");
        $data = json_decode($json_data, true);
        Flight::json(SqlService::selectData($data["Table"],$data["Columns"],$data["Conditions"],$data["GroupBy"],$data["OrderBy"]));
    }

}