<?php

class Times{
    public static function getSelects($grupo){
        $statement = Flight::db()->prepare("SELECT cedula, nadador FROM nadador WHERE grupo=$grupo");
        $statement->execute();
        $data = $statement->fetchAll();
        $statement2 = Flight::db()->prepare("SELECT * FROM metros");
        $statement2->execute();
        $data2 = $statement2->fetchAll();
        $statement3 = Flight::db()->prepare("SELECT * FROM pruebas");
        $statement3->execute();
        $data3 = $statement3->fetchAll();

        $statement4 = Flight::db()->prepare("SELECT * FROM competencia");
        $statement4->execute();
        $data4 = $statement4->fetchAll();

        $statement5 = Flight::db()->prepare("SELECT * FROM institucion");
        $statement5->execute();
        $data5 = $statement5->fetchAll();

        $mapNadador = array_map(function ($key) {
            return ["cedula" => $key["cedula"], "nadador" => $key["nadador"]];
        }, $data);

        $mapMetros = array_map(function ($key) {
            return ["id" => $key["id"], "nombre" => $key["metros"]];
        }, $data2);

        $mapPrueba = array_map(function ($key) {
            return ["id" => $key["id"], "nombre" => $key["nombre"]];
        }, $data3);

        $mapCompetencia = array_map(function ($key) {
            return ["id" => $key["id"], "nombre" => $key["nombre"]];
        }, $data4);
        $mapInstitucion = array_map(function ($key) {
            return ["id" => $key["id"], "nombre" => $key["nombre"]];
        }, $data5);
        $combinedData = array(
            "mapNadador" => $mapNadador, 
            "mapMetros" => $mapMetros, 
            "mapPrueba" => $mapPrueba,
            "mapCompetencia" => $mapCompetencia,
            "mapInstitucion" => $mapInstitucion
        );

        Flight::json($combinedData);
    }


    public static function addTimes(){
        $datos = json_decode(Flight::request()->getBody());

        $arrayTimes = [];
        allFunctions::addElementoToArray($arrayTimes, "cedula");
        allFunctions::addElementoToArray($arrayTimes, "fecha");
        allFunctions::addElementoToArray($arrayTimes, "prueba");
        allFunctions::addElementoToArray($arrayTimes, "metros");
        allFunctions::addElementoToArray($arrayTimes, "tiempo");

        $arrayPruebas = [
            "PR_L", "BR_L", "Libre", "PR_E", "BR_E", "Espalda",
            "PR_P", "BR_P", "Pecho", "PR_M", "BR_M", "Mariposa","CI","10Pruebas","12Pruebas"
        ];

        for ($i = 0; $i < count($arrayPruebas); $i++) {
            if ($datos->{$arrayPruebas[$i]}) {
                allFunctions::addElementoToArray($arrayTimes, "prueba",$arrayPruebas[$i]);
                allFunctions::addElementoToArray($arrayTimes, "tiempo",$datos->{$arrayPruebas[$i]});
                SqlService::saveData("tiempos",$arrayTimes);
            }

        }
        $combinedData = array("mensaje" => "addTimes");
        Flight::json($combinedData);
    }
    public static function editTimes(){
        $datos = json_decode(Flight::request()->getBody());

        $arrayTimes = [];
        allFunctions::addElementoToArray($arrayTimes, "cedula");
        allFunctions::addElementoToArray($arrayTimes, "fecha");
        allFunctions::addElementoToArray($arrayTimes, "prueba");
        allFunctions::addElementoToArray($arrayTimes, "metros");
        allFunctions::addElementoToArray($arrayTimes, "tiempo");

        $arrayPruebas = [
            "PR_L", "BR_L", "Libre", "PR_E", "BR_E", "Espalda",
            "PR_P", "BR_P", "Pecho", "PR_M", "BR_M", "Mariposa","CI","10Pruebas","12Pruebas"
        ];

        for ($i = 0; $i < count($arrayPruebas); $i++) {
            if ($datos->{$arrayPruebas[$i]}) {
                allFunctions::addElementoToArray($arrayTimes, "prueba",$arrayPruebas[$i]);
                allFunctions::addElementoToArray($arrayTimes, "tiempo",$datos->{$arrayPruebas[$i]});
            }
        }
        $combinedData = array("mensaje" => "editTimes");

        Flight::json($combinedData);
    }
    public static function viewTimes(){
        $datos = json_decode(Flight::request()->getBody());
        $cedula=$datos->cedula;
        $metros=$datos->metros;

        $statement = Flight::db()->prepare("SELECT MIN(tiempo) AS tiempo_minimo, prueba
        FROM tiempos
        WHERE cedula = $cedula AND metros = '$metros'
        GROUP BY prueba
        ORDER BY tiempo_minimo ASC;
        ");
        $statement->execute();
        $data = $statement->fetchAll();
        $map = array_map(function ($key) {
            return ["prueba" => $key["prueba"], "tiempo" => $key["tiempo_minimo"]];
        }, $data);
        $combinedData = array("tiempos" => $map, "mensaje" => "viewTimes");

        
        Flight::json($combinedData);
    }
}
