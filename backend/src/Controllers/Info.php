<?php

class Info{
    public static function getInfo(){
        $respuesta=null;
        $statement = Flight::db()->prepare("SELECT
        (SELECT GROUP_CONCAT(cedula SEPARATOR '..|..')
         FROM nadador
         WHERE grupo != 4) AS cedulas,
         (SELECT GROUP_CONCAT(nadador SEPARATOR '..|..')
         FROM nadador
         WHERE grupo != 4) AS nadador,
        (SELECT GROUP_CONCAT(nombre SEPARATOR '..|..')
         FROM pruebas) AS pruebas,
        (SELECT GROUP_CONCAT(metros SEPARATOR '..|..')
         FROM metros) AS metros;");
        $statement->execute();
        $data = $statement->fetchAll();
        $arrayCedulas=explode("..|..",$data[0]["cedulas"]);
        $arrayNadador=explode("..|..",$data[0]["nadador"]);
        $arrayMetros=explode("..|..",$data[0]["metros"]);
        $arrayPruebas=explode("..|..",$data[0]["pruebas"]);

        for ($i=0; $i < count($arrayCedulas); $i++) { 
            $cedula=$arrayCedulas[$i];
            $nadador=$arrayNadador[$i];
            $respuesta.="<br>";
            $respuesta.="$nadador:";
            for ($j=0; $j < count($arrayMetros); $j++) { 
                $metros=$arrayMetros[$j];
                $respuesta.="<br>";
                $respuesta.="$metros: ";

                for ($k=0; $k < count($arrayPruebas); $k++) { 
                    $prueba=$arrayPruebas[$k];
                    $statement2 = Flight::db()->prepare("SELECT * FROM tiempos WHERE cedula=$cedula AND metros='$metros' AND prueba='$prueba'");
                    $statement2->execute();
                    $data2 = $statement2->fetchAll();
                    if (count($data2) > 0) {
                        // $respuesta.=$prueba;
                        // $respuesta.="<br>";
                    }else{
                        $respuesta.="$prueba,";
                    }
                }
            }


        }
        Flight::json($respuesta);
    }
    public static function getComparacion(){
        $datos = json_decode(Flight::request()->getBody());
        $cedula=$datos->cedula;
        $respuesta="";
        $statement = Flight::db()->prepare("SELECT nadador.nadador,evento.prueba,serie.tiempo FROM serie INNER JOIN
        evento ON evento.id = serie.id_evento INNER JOIN
        nadador ON nadador.cedula = serie.cedula WHERE serie.cedula=$cedula");
        $statement->execute();
        $data = $statement->fetchAll();
        foreach ($data as $clave => $valor) {
            $respuesta.=$valor['prueba']."=".$valor['tiempo']."\n";
        }
        Flight::json($respuesta);
    }
    public static function getRecords(){

        $datos = json_decode(Flight::request()->getBody());
        $array=SqlService::selectData($datos->Table,$datos->Columns,$datos->Conditions,$datos->GroupBy,$datos->OrderBy);
        
        $respuesta=$array;
        Flight::json($respuesta);
    }

}
