<?php


class TiemposController
{
    /*
        Esta funcion logea y atentica el usario en el servidor
    */
    public static function getTiemposByCI($data){
        Flight::json(SqlService::selectData(Tiempos::$tableName,[],[Tiempos::$cedula=>$data],null,null));
        // Flight::json($data);
    }
    public static function getTiemposByMetrosPrueba($cedula,$metros,$prueba){
        

        $Tiempos=SqlService::selectData(Tiempos::$tableName,["fecha","tiempo"],[Tiempos::$cedula=>$cedula,Tiempos::$metros=>$metros,Tiempos::$prueba=>$prueba],null,null);


        $objetoEjemplo= allFunctions::ordenarYObtenerObjeto($Tiempos);
        $tiempoRecord= allFunctions::obtenerTiempoMasPequeno($Tiempos);

        Flight::json(["obj"=>$objetoEjemplo,"tiempoRecord"=>$tiempoRecord]);

    }
    public static function getAllTiemposRecordsById($cedula) {
        $Tiempos = SqlService::selectData(Tiempos::$tableName,
            ["MIN(tiempo) AS tiempo","Prueba","Metros","Fecha"],
            [Tiempos::$cedula => $cedula], "Prueba,Metros", null);
        Flight::json(["array" => allFunctions::getTiemposProcesadorBarChart($Tiempos)]);
    }
    
    
    
   

}



