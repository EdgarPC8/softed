<?php

class SeriesController{
    
    public static function addSerie(){
        $body = json_decode(Flight::request()->getBody());

        $respuesta=false;
        $idSerie=SqlService::saveData("serie", (object)[
            "id_evento"=>$body->idEvento,
            "carril"=>$body->carril,
            "numero"=>$body->numeroSerie,
            "cedula"=>$body->cedula,
            "nadador"=>$body->primer_nombre.' '.$body->primer_apellido,
            "id_institucion"=>$body->id_institucion,
        ]);

        if($idSerie){
            Flight::json(["message"=>"","nad"=>$body,"id"=>$idSerie]);
        }

    }
    public static function removeSerie($id)
    {

        $where = (object) [
            "id" => $id,
        ];
        if (SqlService::deleteData("serie", $where)) {
            Flight::json(["message" => "Nadador eliminado"]);
        }

    }


}