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
            ["MIN(tiempo) AS tiempo","fecha","prueba","metros"],
            ["cedula"=> $cedula], "prueba,metros", null);


            $statement = Flight::db()->prepare(
                "SELECT t1.fecha, t1.prueba, t1.metros, t1.tiempo
                FROM tiempos t1
                JOIN (
                  SELECT prueba, metros, MIN(tiempo) AS min_tiempo
                  FROM tiempos
                  WHERE cedula = ' $cedula'
                  GROUP BY prueba, metros
                ) t2 ON t1.prueba = t2.prueba
                   AND t1.metros = t2.metros
                   AND t1.tiempo = t2.min_tiempo
                WHERE t1.cedula = '$cedula'   
            "
            );
            $statement->execute();
            $data = $statement->fetchAll();



             // Ordenar $Tiempos por Fecha ascendente
            usort($data, function($a, $b) {
                return strtotime($a['fecha']) - strtotime($b['fecha']);
            });




        Flight::json(["array" => allFunctions::getTiemposProcesadorBarChart($Tiempos),"minTimeByDate"=>$data]);
    }
    
    
    
   

}



