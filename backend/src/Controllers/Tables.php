<?php

class Tables{
    public static function getTable(){
        $jsonData = $_POST['data'];
        $data = json_decode($jsonData,true);
        Flight::json(SqlService::selectData($data["Table"],$data["Columns"],$data["Conditions"],$data["GroupBy"],$data["OrderBy"]));
    }
}