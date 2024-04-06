<?php

class Data{
    public static function saveData(){
        $respuesta=false;
        $data = json_decode(Flight::request()->getBody());
        if(SqlService::saveData($data->Table,$data->Columns)){
            $success=[
                "icon"=>"success",
                "title"=>"Éxito",
                "text"=>"Datos procesados correctamente",
            ];
            $respuesta=$success;
        }
        Flight::json($respuesta);
    }
    public static function editData(){
        $respuesta=false;
        $data = json_decode(Flight::request()->getBody());
        if(SqlService::editData($data->Table,$data->Columns,$data->Conditions)){
            $success=[
                "icon"=>"success",
                "title"=>"Éxito",
                "text"=>"Datos procesados correctamente",
            ];
            $respuesta=$success;
            
        }
        
        Flight::json($respuesta);
    }
    public static function deleteData(){
        $respuesta=false;
        $data = json_decode(Flight::request()->getBody());
        if(SqlService::deleteData($data->Table,$data->Conditions)){
            $success=[
                "icon"=>"success",
                "title"=>"Éxito",
                "text"=>"Dato Elminado correctamente",
            ];
            $respuesta=$success;
            
        }
        
        Flight::json($respuesta);
    }
}