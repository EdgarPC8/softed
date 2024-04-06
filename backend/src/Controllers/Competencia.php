<?php

class Competencia{
    // public static function getCompetencias(){
    //     $statement = Flight::db()->prepare("SELECT * FROM competencia");
    //     $statement->execute();
    //     $data = $statement->fetchAll();

    //     $statement2 = Flight::db()->prepare("SELECT * FROM evento");
    //     $statement2->execute();
    //     $data2 = $statement2->fetchAll();

    //     $statement3 = Flight::db()->prepare("SELECT
    //     institucion_nadador.id,
    //     nadador.cedula,
    //     CONCAT(nadador.nombres, ' ', nadador.apellidos) AS nadador,
    //     nadador.genero,
    //     nadador.fecha_nacimiento,
    //     institucion_nadador.id_institucion,
    //     institucion.nombre AS nombreInstitucion,
    //     institucion_nadador.configCheck,
    //     institucion_nadador.categoria
    //     FROM
    //         institucion_nadador
    //     INNER JOIN institucion ON institucion.id = institucion_nadador.id_institucion
    //     INNER JOIN nadador ON nadador.cedula = institucion_nadador.id_nadador
    //     WHERE
    //     nivel = 'Escuela'");
    //     $statement3->execute();
    //     $data3 = $statement3->fetchAll();

        

    //     $statement4 = Flight::db()->prepare("SELECT DISTINCT
    //     institucion.id,institucion.nombre FROM institucion_nadador
    //     INNER JOIN institucion ON institucion.id = institucion_nadador.id_institucion
    //     WHERE institucion_nadador.nivel='Escuela'
    //     ");
    //     $statement4->execute();
    //     $data4 = $statement4->fetchAll();

    //     $statement5 = Flight::db()->prepare("SELECT
    //     institucion_nadador.id,
    //     nadador.cedula,
    //     CONCAT(nadador.nombres, ' ', nadador.apellidos) AS nadador,
    //     nadador.genero,
    //     nadador.fecha_nacimiento,
    //     institucion_nadador.id_institucion,
    //     institucion.nombre AS nombreInstitucion,
    //     institucion_nadador.configCheck,
    //     institucion_nadador.categoria
    //     FROM
    //         institucion_nadador
    //     INNER JOIN institucion ON institucion.id = institucion_nadador.id_institucion
    //     INNER JOIN nadador ON nadador.cedula = institucion_nadador.id_nadador
    //     WHERE
    //     nivel = 'Colegio'");
    //     $statement5->execute();
    //     $data5 = $statement5->fetchAll();

    //     $statement6 = Flight::db()->prepare("SELECT DISTINCT
    //     institucion.id,institucion.nombre FROM institucion_nadador
    //     INNER JOIN institucion ON institucion.id = institucion_nadador.id_institucion
    //     WHERE institucion_nadador.nivel='Colegio'
    //     ");
    //     $statement6->execute();
    //     $data6 = $statement6->fetchAll();

    //     $mapCompetencia = array_map(function ($key) {
    //         return ["id" => $key["id"],"nombre" => $key["nombre"], "fecha" => $key["fecha"]];
    //     }, $data);
    //     $mapEvento = array_map(function ($key) {
    //         return ["id_competencia" => $key["id_competencia"],"numero" => $key["numero"], "prueba" => $key["prueba"], "categoria" => $key["categoria"], "genero" => $key["genero"]];
    //     }, $data2);
    //     $mapAsignacionNadEsc = array_map(function ($key) {
    //         return [
    //             "id" => $key["id"],
    //             "cedula" => $key["cedula"], 
    //             "nadador" => $key["nadador"], 
    //             "genero" => $key["genero"], 
    //             "fecha_nacimiento" => $key["fecha_nacimiento"], 
    //             "categoria" => $key["categoria"], 
    //             "id_institucion" => $key["id_institucion"], 
    //             "nombreInstitucion" => $key["nombreInstitucion"],
    //             "configCheck" => $key["configCheck"]
    //     ];
    //     }, $data3);
    //     $mapEscuelas = array_map(function ($key) {
    //         return ["id" => $key["id"],"nombre" => $key["nombre"]];
    //     }, $data4);
    //     $mapAsignacionNadCol = array_map(function ($key) {
    //         return [
    //             "id" => $key["id"],
    //             "cedula" => $key["cedula"], 
    //             "nadador" => $key["nadador"], 
    //             "genero" => $key["genero"], 
    //             "fecha_nacimiento" => $key["fecha_nacimiento"], 
    //             "categoria" => $key["categoria"], 
    //             "id_institucion" => $key["id_institucion"], 
    //             "nombreInstitucion" => $key["nombreInstitucion"],
    //             "configCheck" => $key["configCheck"]
    //     ];
    //     }, $data5);
    //     $mapColegios = array_map(function ($key) {
    //         return ["id" => $key["id"],"nombre" => $key["nombre"]];
    //     }, $data6);

    //     $combinedData = array(
    //         "mapCompetencia" => $mapCompetencia,
    //         "mapEvento" => $mapEvento,
    //         "mapAsignacionNadEsc" => $mapAsignacionNadEsc,
    //         "mapEscuelas" => $mapEscuelas,
    //         "mapColegios" => $mapColegios,
    //         "mapAsignacionNadCol" => $mapAsignacionNadCol
    //     );

    //     Flight::json($combinedData);
    // }
    // public static function addCompetencia(){
    //     $respuesta=null;
    //     $datos = json_decode(Flight::request()->getBody());
    //     $Arrayfecha=explode("-",$datos->fecha);
    //     $fecha=$Arrayfecha[2]."-".$Arrayfecha[1]."-".$Arrayfecha[0];
    //     $nombreCompetencia=$datos->nombre_competencia;

    //     $arrayCompetencia = [];
    //     allFunctions::addElementoToArray($arrayCompetencia, "nombre");
    //     allFunctions::addElementoToArray($arrayCompetencia, "fecha");

    //     allFunctions::addElementoToArray($arrayCompetencia, "nombre","$nombreCompetencia");
    //     allFunctions::addElementoToArray($arrayCompetencia, "fecha","$fecha");

    //     if(SqlService::saveData("competencia",$arrayCompetencia)){
    //         $respuesta="Se creo exitosamente la competencia";
    //     }


    //     Flight::json($respuesta);
    // }
    // public static function addEvento(){
    //     $respuesta=null;
    //     $datos = json_decode(Flight::request()->getBody(), true);
    //     $array=$datos["eventosSeries"];
    //     $idCompetencia=$datos["id_competencia"];
    //     $arrayEvento = [];
    //     allFunctions::addElementoToArray($arrayEvento, "id_competencia");
    //     allFunctions::addElementoToArray($arrayEvento, "numero");
    //     allFunctions::addElementoToArray($arrayEvento, "prueba");
    //     allFunctions::addElementoToArray($arrayEvento, "categoria");
    //     allFunctions::addElementoToArray($arrayEvento, "genero");
    //     $arraySerie = [];
    //     allFunctions::addElementoToArray($arraySerie, "id_evento");
    //     allFunctions::addElementoToArray($arraySerie, "numero");
    //     allFunctions::addElementoToArray($arraySerie, "cedula");
    //     allFunctions::addElementoToArray($arraySerie, "nadador");
    //     allFunctions::addElementoToArray($arraySerie, "institucion");
    //     allFunctions::addElementoToArray($arraySerie, "tiempo");
    //     foreach ($array as $key => $value) {
    //         allFunctions::addElementoToArray($arrayEvento, "id_competencia",$idCompetencia);
    //         allFunctions::addElementoToArray($arrayEvento, "numero",$value["id"]+1);
    //         allFunctions::addElementoToArray($arrayEvento, "prueba",$value["prueba"]);
    //         allFunctions::addElementoToArray($arrayEvento, "categoria",$value["cat"]);
    //         allFunctions::addElementoToArray($arrayEvento, "genero",$value["genero"]);
    //         $idEvento=SqlService::saveData("evento",$arrayEvento);
    //         // $idEvento=null;
    //         $arraySeries=$value["series"];
    //         foreach ($arraySeries as $keySerie => $valueSerie) {
    //             foreach ($valueSerie as $keyNadadores => $valueNadadores) {
    //                 $id = preg_replace('/[^0-9]/', '', $keySerie);
    //                 allFunctions::addElementoToArray($arraySerie, "id_evento",$idEvento);
    //                 allFunctions::addElementoToArray($arraySerie, "numero",$id);
    //                 allFunctions::addElementoToArray($arraySerie, "cedula",$valueNadadores["cedula"]);
    //                 allFunctions::addElementoToArray($arraySerie, "nadador",$valueNadadores["nadador"]);
    //                 allFunctions::addElementoToArray($arraySerie, "institucion",$valueNadadores["institucion"]);
    //                 // print_r($arraySerie);
    //                 SqlService::saveData("serie",$arraySerie);
    //             }
    //         }
    //     }
        
    //     // $idEvento=SqlService::saveData("evento",$arrayEvento);

    //     // print_r($idEvento);


    //     // if(SqlService::saveData("evento",$arrayEvento)){
    //     //     $respuesta="Se creo exitosamente el Evento";
    //     // }
    // }
    // public static function actualizarCompetencia(){
    //     $respuesta=null;
    //     $statement = Flight::db()->prepare("SELECT
    //     institucion_nadador.id,
    //     nadador.cedula,
    //     CONCAT(nadador.nombres, ' ', nadador.apellidos) AS nadador,
    //     nadador.genero,
    //     nadador.fecha_nacimiento,
    //     nadador.grupo,
    //     institucion_nadador.id_institucion,
    //     institucion.nombre AS nombreInstitucion,
    //     institucion_nadador.configCheck,
    //     institucion_nadador.categoria,
    //     institucion_nadador.nivel
    //     FROM
    //         institucion_nadador
    //     INNER JOIN institucion ON institucion.id = institucion_nadador.id_institucion
    //     INNER JOIN nadador ON nadador.cedula = institucion_nadador.id_nadador
    //     ORDER BY
    //     CAST(SUBSTRING_INDEX(institucion_nadador.categoria, '-', 1) AS SIGNED) ASC,
    //     nadador.grupo ASC;
    
    //         ");
    //     $statement->execute();
    //     $ResultCompetencia = $statement->fetchAll();
    //     $arrayCompetencia= array();
    //     $Competencia = array();
    //     if(count($ResultCompetencia)>0){
    //         for ($i=0; $i < count($ResultCompetencia); $i++) { 
    //             $cedula=$ResultCompetencia[$i]["cedula"];
    //             $nadador=$ResultCompetencia[$i]["nadador"];
    //             $institucion=$ResultCompetencia[$i]["nombreInstitucion"];
    //             $categoria=$ResultCompetencia[$i]["categoria"];
    //             $genero=$ResultCompetencia[$i]["genero"];
    //             $nivel=$ResultCompetencia[$i]["nivel"];
    //             $grupo=$ResultCompetencia[$i]["grupo"];
    //             $arrayPruebas = json_decode($ResultCompetencia[$i]["configCheck"], true);
    //             foreach ($arrayPruebas as $clave => $valor) {
    //                 $arrayNadador= [];
    //                 $arrayNadador["cedula"] = $cedula;
    //                 $arrayNadador["nadador"] = $nadador;
    //                 $arrayNadador["institucion"] = $institucion;
    //                 $arrayNadador["grupo"] = $grupo;
    //                 $arrayNadador["tiempo"] = "";
    //                 if($valor==1){
    //                     if(isset($arrayCompetencia[$nivel]["Evento|$categoria|$clave|$genero"])){
    //                             array_push($arrayCompetencia[$nivel]["Evento|$categoria|$clave|$genero"], $arrayNadador);
    //                     }else{
    //                         $arraySerie=[];
    //                         $arraySerie[] = $arrayNadador;
    //                             $arrayCompetencia[$nivel]["Evento|$categoria|$clave|$genero"]=$arraySerie;
    //                     }
    //                 }
    //             }
    //         }
    //     }
       
    //     function series($Competencia,$arrayCompetencia){
    //         $sizeArray=count($arrayCompetencia);
    //         $seriesPorElemento=null;
    //         $elementos=null;
    //         $arrayPrueba=[];
    //         if ($sizeArray % 4 === 0) {
    //             $elementos = 4;
    //             $seriesPorElemento = $sizeArray / $elementos;
    //             for ($i=0; $i < $seriesPorElemento; $i++) { 
    //                 array_push($arrayPrueba, 4);
    //             }

    //         }else if ($sizeArray % 3 === 0 && $sizeArray<15) {
    //             $elementos = 3;
    //             $seriesPorElemento = $sizeArray / $elementos;
    //             for ($i=0; $i < $seriesPorElemento; $i++) { 
    //                 array_push($arrayPrueba, 3);
    //             }
    //         }else if ($sizeArray ===5) {
    //             array_push($arrayPrueba, 3);
    //             array_push($arrayPrueba, 2);
    //         }else if($sizeArray===1){
    //             array_push($arrayPrueba, 1);
    //         }else if($sizeArray===2){
    //             array_push($arrayPrueba, 2);
    //         }else{
    //             if(($sizeArray-3) % 4 === 0){
    //                 for ($i=0; $i < (($sizeArray-3)/4); $i++) { 
    //                     array_push($arrayPrueba, 4);
    //                 }
    //                 array_push($arrayPrueba, 3);
    //             }else if(($sizeArray-6) % 4 === 0){
    //                 for ($i=0; $i < (($sizeArray-6)/4); $i++) { 
    //                     array_push($arrayPrueba, 4);
    //                 }
    //                 array_push($arrayPrueba, 3);
    //                 array_push($arrayPrueba, 3);
    //             }else if(($sizeArray-9) % 4 === 0){
    //                 for ($i=0; $i < (($sizeArray-9)/4); $i++) { 
    //                     array_push($arrayPrueba, 4);
    //                 }
    //                 array_push($arrayPrueba, 3);
    //                 array_push($arrayPrueba, 3);
    //                 array_push($arrayPrueba, 3);
    //             }
                

    //         }
    //         $sum=0;

    //         if(count($arrayPrueba)>0){
    //             for ($i=0; $i < count($arrayPrueba); $i++) {
    //                 for ($j=0; $j < $arrayPrueba[$i]; $j++) { 
    //                     $Competencia["Serie".($i+1)][$j+$sum]=$arrayCompetencia[$j+$sum];
    //                 }
    //                 $sum=$sum+$arrayPrueba[$i];
    //             }
    //         }
            
    //         return $Competencia;
    //     }

    //     foreach ($arrayCompetencia as $clave => $valor) {
    //         foreach ($arrayCompetencia[$clave] as $clave2 => $valor2) {
    //             if(!isset($Competencia[$clave][$clave2])){
    //                 $Competencia[$clave][$clave2]=[];
    //                 $Competencia[$clave][$clave2]=series($Competencia[$clave][$clave2],$arrayCompetencia[$clave][$clave2]);
    //             }
    //         }
    //     }
        
    //     $CompetenciaNatacion["Natacion"]=$Competencia;
    //     $respuesta=$CompetenciaNatacion;
    //     // print_r($respuesta);

        
    //     Flight::json($respuesta);

    // }
    // public static function addInstitucion(){
    //     $respuesta=null;
    //     $datos = json_decode(Flight::request()->getBody());

    //     $arrayInstitucion = [];
    //     allFunctions::addElementoToArray($arrayInstitucion, "nombre");

    //     if(SqlService::saveData("institucion",$arrayInstitucion)){
    //         $respuesta="Se creo exitosamente la Institucion";
    //     }
    //     Flight::json($respuesta);
    // }
    // public static function addNadador(){
    //     $respuesta=null;
    //     $datos = json_decode(Flight::request()->getBody());

    //     $arrayFecha=explode("-",$datos->fecha_nacimiento);
    //     $fecha=$arrayFecha[2]."-".$arrayFecha[1]."-".$arrayFecha[0];

    //     $arrayNadador = [];
    //     allFunctions::addElementoToArray($arrayNadador, "cedula");
    //     allFunctions::addElementoToArray($arrayNadador, "nadador");
    //     allFunctions::addElementoToArray($arrayNadador, "nombres");
    //     allFunctions::addElementoToArray($arrayNadador, "apellidos");
    //     allFunctions::addElementoToArray($arrayNadador, "fecha_nacimiento");
    //     allFunctions::addElementoToArray($arrayNadador, "genero");
    //     allFunctions::addElementoToArray($arrayNadador, "grupo");

    //     allFunctions::addElementoToArray($arrayNadador, "fecha_nacimiento",$fecha);
    //     allFunctions::addElementoToArray($arrayNadador, "nadador",$datos->nombres1." ".$datos->apellidos1);

    //     if(SqlService::saveData("nadador",$arrayNadador)){
    //         $respuesta="Se creo exitosamente el Nadador";
    //     }
    //     Flight::json($respuesta);
    // }
    // public static function addInstitucionNadador(){
    //     $respuesta=null;
    //     $datos = json_decode(Flight::request()->getBody());

    //     $arrayInstitucion = [];
    //     allFunctions::addElementoToArray($arrayInstitucion, "id_nadador");
    //     allFunctions::addElementoToArray($arrayInstitucion, "id_institucion");
    //     allFunctions::addElementoToArray($arrayInstitucion, "nivel");
    //     allFunctions::addElementoToArray($arrayInstitucion, "categoria");
    //     allFunctions::addElementoToArray($arrayInstitucion, "configCheck");

    //     $miArray = array(
    //         'PR_L' => '0',
    //         'PR_E' => '0',
    //         'Lib' => '0',
    //         'Esp' => '0',
    //         'Pech' => '0',
    //         'Mari' => '0',
    //         'CI' => '0'
    //     );
    //     $arrayString = json_encode($miArray);

    //     allFunctions::addElementoToArray($arrayInstitucion, "configCheck",$arrayString);

    //     if(SqlService::saveData("institucion_nadador",$arrayInstitucion)){
    //         $respuesta="Se asigno un Nadador a  la Institucion";
    //     }
    //     Flight::json($respuesta);
    // }
    // public static function editTimes(){
    //     $datos = json_decode(Flight::request()->getBody());

    //     $arrayTimes = [];
    //     allFunctions::addElementoToArray($arrayTimes, "cedula");
    //     allFunctions::addElementoToArray($arrayTimes, "fecha");
    //     allFunctions::addElementoToArray($arrayTimes, "prueba");
    //     allFunctions::addElementoToArray($arrayTimes, "metros");
    //     allFunctions::addElementoToArray($arrayTimes, "tiempo");

    //     $arrayPruebas = [
    //         "PR_L", "BR_L", "Libre", "PR_E", "BR_E", "Espalda",
    //         "PR_P", "BR_P", "Pecho", "PR_M", "BR_M", "Mariposa","CI","10Pruebas","12Pruebas"
    //     ];

    //     for ($i = 0; $i < count($arrayPruebas); $i++) {
    //         if ($datos->{$arrayPruebas[$i]}) {
    //             allFunctions::addElementoToArray($arrayTimes, "prueba",$arrayPruebas[$i]);
    //             allFunctions::addElementoToArray($arrayTimes, "tiempo",$datos->{$arrayPruebas[$i]});
    //         }
    //     }
    //     $combinedData = array("mensaje" => "editTimes");

    //     Flight::json($combinedData);
    // }
    // public static function viewTimes(){
    //     $datos = json_decode(Flight::request()->getBody());
    //     $cedula=$datos->cedula;
    //     $metros=$datos->metros;

    //     $statement = Flight::db()->prepare("SELECT MIN(tiempo) AS tiempo_minimo, prueba
    //     FROM tiempos
    //     WHERE cedula = $cedula AND metros = '$metros'
    //     GROUP BY prueba
    //     ORDER BY tiempo_minimo ASC;
    //     ");
    //     $statement->execute();
    //     $data = $statement->fetchAll();
    //     $map = array_map(function ($key) {
    //         return ["prueba" => $key["prueba"], "tiempo" => $key["tiempo_minimo"]];
    //     }, $data);
    //     $combinedData = array("tiempos" => $map, "mensaje" => "viewTimes");

        
    //     Flight::json($combinedData);
    // }
    // public static function getNadador($nadador){
    //     $condition = "nadador LIKE LOWER('%$nadador%')";
    //     $statement = Flight::db()->prepare("SELECT * FROM nadador WHERE  $condition LIMIT 5");
    //     $statement->execute();
    //     $nadador = $statement->fetchAll();
    //     count($nadador) > 0 ? Flight::json($nadador) : Flight::json("not found");
    // }
    // public static function deleteAsigNad($idNadador){
    //     $id = str_replace("nadador", "", $idNadador);

    //     SqlService::deleteData("institucion_nadador","id=$id");
    //     Flight::json($id);
    // }
    // public static function deleteEventosSeries(){
    //     $datos = json_decode(Flight::request()->getBody());
    //     // print_r($datos);
    //     $id=$datos->id_competencia;
    //     $statement = Flight::db()->prepare("DELETE FROM serie 
    //     WHERE id_evento IN (
    //         SELECT id 
    //         FROM evento 
    //         WHERE id_competencia = $id
    //     );
        
    //     DELETE FROM evento 
    //     WHERE id_competencia = $id;");
    //     $statement->execute();
    //     // $data = $statement->fetchAll();
    //     print_r($statement);

    //     // $id = str_replace("nadador", "", $id);

    //     // SqlService::deleteData("institucion_nadador","id=$id");
    //     // Flight::json($id);
    // }
    // public static function editConfigCheck(){
    //     $datos = json_decode(Flight::request()->getBody());
    //     $arrayConfigCheck = [];
    //     allFunctions::addElementoToArray($arrayConfigCheck, "configCheck");
    //     allFunctions::addElementoToArray($arrayConfigCheck, "configCheck",$datos->arrayConfig);

    //     $respuesta=SqlService::updateDatas("institucion_nadador", $arrayConfigCheck, "id_nadador=$datos->cedula");

    //     Flight::json($respuesta);
    // }
    // public static function getCompetencia($id){
    //     $statement = Flight::db()->prepare("SELECT * FROM competencia INNER JOIN
    //     evento ON evento.id_competencia = competencia.id INNER JOIN
    //     serie ON serie.id_evento = evento.id WHERE competencia.id=$id
    //     ");
    //     $statement->execute();
    //     $dataEventos = $statement->fetchAll();
    //     $arrayCompetencia=[];
    //     foreach ($dataEventos as $clave => $valor) {
    //         $categoria=$valor["categoria"];
    //         $prueba=$valor["prueba"];
    //         $genero=$valor["genero"];
            
    //         $arrayNadador= [];
    //         $arrayNadador["id"] = $valor["id"];
    //         $arrayNadador["cedula"] = $valor["cedula"];
    //         $arrayNadador["nadador"] = $valor["nadador"];
    //         $arrayNadador["institucion"] = $valor["institucion"];
    //         $arrayNadador["tiempo"] = $valor["tiempo"];
    //         $arrayNadador["descalificado"] = $valor["descalificado"];
    //         $arrayNadador["premiado"] = $valor["premiado"];
    //         $arrayNadador["lugar"] = $valor["lugar"];
    //         $arrayCompetencia["Evento|$categoria|$prueba|$genero"]["Serie".$valor["numero"]][]=$arrayNadador;

    //     }
    //     // print_r($dataEventos);
    //     Flight::json($arrayCompetencia);

    // }
    // public static function putTimeCompetencia($id,$tiempo){
    //     $array = ["tiempo"=>$tiempo];
    //     SqlService::updateDatas("serie", $array, "id=$id");
    //     // Flight::json($array);
    // }
    // public static function getResultadosCompetencia($id){

    //     $statement = Flight::db()->prepare("SELECT *
    //     FROM competencia
    //     INNER JOIN evento ON evento.id_competencia = competencia.id
    //     INNER JOIN serie ON serie.id_evento = evento.id
    //     WHERE competencia.id = $id
    //     ORDER BY evento.numero ASC, 
    //              CASE WHEN serie.descalificado = 1 THEN 1 ELSE 0 END, 
    //              serie.tiempo ASC;
    //     ");
    //     $statement->execute();
    //     $resultadosCompetencia = $statement->fetchAll();
    //     $arrayCompetencia=[];
        
    //     function obtenerPruebaMetros($clave) {
    //         $mapeo = [
    //             "25PR_L" => "25 metros Patada de libre",
    //             "25PR_E" => "25 metros Patada de Espalda",
    //             "25Lib" => "25 metros Estilo Libre",
    //             "25Esp" => "25 metros Estilo Espalda",
    //             "25Pech" => "25 metros Estilo Pecho",
    //             "25Mari" => "25 metros Estilo Mariposa",
    //             "100CI" => "100 metros Combinado Individual",
    //             "50Lib" => "50 metros Estilo Libre",
    //             "50Esp" => "50 metros Estilo Espalda",
    //             "50Pech" => "50 metros Estilo Pecho",
    //             "50Mari" => "50 metros Estilo Mariposa"
    //         ];
    //         return isset($mapeo[$clave]) ? $mapeo[$clave] : $clave;
    //     }
    //     function obtenerGenero($clave) {
    //         $mapeo = [
    //             "F" => "Femenino",
    //             "M" => "Masculino",
    //         ];
    //         return isset($mapeo[$clave]) ? $mapeo[$clave] : $clave;
    //     }

    //     foreach ($resultadosCompetencia as $clave => $valor) {
    //         $categoria=$valor["categoria"];
    //         // $prueba=$valor["prueba"];
    //         $prueba=obtenerPruebaMetros($valor["prueba"]);
    //         $genero=obtenerGenero($valor["genero"]);
            
    //         $arrayNadador= [];
    //         $arrayNadador["id"] = $valor["id"];
    //         $arrayNadador["cedula"] = $valor["cedula"];
    //         $arrayNadador["nadador"] = $valor["nadador"];
    //         $arrayNadador["institucion"] = $valor["institucion"];
    //         $arrayNadador["tiempo"] = $valor["tiempo"];
    //         $arrayNadador["descalificado"] = $valor["descalificado"];
    //         $arrayNadador["premiado"] = $valor["premiado"];
    //         $arrayNadador["lugar"] = $valor["lugar"];
    //         $arrayCompetencia["$prueba $genero, $categoria años de edad"][]=$arrayNadador;
    //     }
    //     // print_r($arrayCompetencia);
    //     Flight::json($arrayCompetencia);

    // }
    // public static function changeDescPuntos(){
    //     $datos = json_decode(Flight::request()->getBody());
    //     $array = get_object_vars($datos->array);
    //     $tabla=$datos->tabla;
    //     $id=$datos->id;
    //     //     SqlService::updateDatas("$tabla", $array, "$id");
    //     //     // Flight::json($arrayCompetencia);
    //     // }
    //     // public static function getGanador($id){
    //     //     $statement = Flight::db()->prepare("SELECT serie.institucion, SUM(serie.puntos) AS total_puntos
    //     //     FROM competencia
    //     //     INNER JOIN evento ON evento.id_competencia = competencia.id
    //     //     INNER JOIN serie ON serie.id_evento = evento.id
    //     //     WHERE competencia.id = $id
    //     //     GROUP BY serie.institucion
    //     //     ORDER BY total_puntos DESC;
    //     //     ");
    //     //     $statement->execute();
    //     //     $resultadosCompetencia = $statement->fetchAll();
            
    //     //     Flight::json($resultadosCompetencia);

    // }

    public static function getEntidadCompetencia(){
        $respuesta=false;
        $data = json_decode(Flight::request()->getBody());

        function getCategorias($stringDate){
            $Categorias=[
                "2004-2005"=>[2004,2005],
                "2006-2007"=>[2006,2007],
                "2008-2009"=>[2008,2009],
                "2010-2011"=>[2010,2011],
                "2012-2013"=>[2012,2013],
                "2014-2015"=>[2014,2015],
                "2016-2017"=>[2016,2017],
            ];
            $div=explode("-",$stringDate);
            $CatAnio=intval($div[2]);
            foreach ($Categorias as $keyCat => $valueCat) {
                foreach ($valueCat as $keyAnio => $valueAnio) {
                    if($CatAnio==$valueAnio){
                        return $keyCat;
                    }
                }
            }
        }
        

        $arrayDistribucion=[];
        $arrayEntidad=[];
        $array=SqlService::selectData("institucion_nadador 
        INNER JOIN nadador ON nadador.cedula=institucion_nadador.id_nadador 
        INNER JOIN competencia ON competencia.id=institucion_nadador.id_competencia 
        INNER JOIN institucion ON institucion.id=institucion_nadador.id_institucion
        ",
        ["institucion.nombre AS entidad","nadador.cedula","nadador.fecha_nacimiento","Concat(nadador.nombres,' ',nadador.apellidos) AS nadador","institucion_nadador.*"],["id_competencia"=>$data->IdCompetencia],null,null);
        foreach ($array as $clave => $valor) {
            $arrayDistribucion[$valor["entidad"]][$valor["cedula"]]=$valor;
        }
        $contador=0;
        foreach ($arrayDistribucion as $clave => $valor) {
            $arrayNadador=[];
            foreach ($valor as $key => $nad) {
                $arrayNadador[]=[
                    "Id"=>$nad["id"],
                    "Cedula"=>$nad["cedula"],
                    "Nadador"=>$nad["nadador"],
                    "Categoria"=>getCategorias($nad["fecha_nacimiento"]) ,
                    "ArrayChecks"=>json_decode($nad["configCheck"]),
                    
                ];
            }
            $arrayEntidad[]=[
                "Id"=>$contador,
                "Nombre"=>$clave,
                "Nadadores"=>$arrayNadador
            ];
            $contador++;
        }

        $respuesta=$arrayEntidad;
        Flight::json($respuesta);
    }



    // public static function administrarCompetencia(){
    //     $respuesta=false;
    //     $data = json_decode(Flight::request()->getBody());

    //     function getCategoria($stringDate){
    //         $Categorias=[
    //             "2004-2005"=>[2004,2005],
    //             "2006-2007"=>[2006,2007],
    //             "2008-2009"=>[2008,2009],
    //             "2010-2011"=>[2010,2011],
    //             "2012-2013"=>[2012,2013],
    //             "2014-2015"=>[2014,2015],
    //             "2016-2017"=>[2016,2017],
    //         ];
    //         $div=explode("-",$stringDate);
    //         $CatAnio=intval($div[2]);
    //         foreach ($Categorias as $keyCat => $valueCat) {
    //             foreach ($valueCat as $keyAnio => $valueAnio) {
    //                 if($CatAnio==$valueAnio){
    //                     return $keyCat;
    //                 }
    //             }
    //         }
    //     }
    //     function descomponerValor($valor, $limiteSuperior) {
    //         $numeros = array();
    //         if(ceil($valor / 2)<=$limiteSuperior){
    //             $primerValor=ceil($valor / 2);
    //             $segundoValor=$valor-$primerValor;
    //             $numeros=[$segundoValor,$primerValor];
    //             return $numeros;
    //         }else if(ceil($valor / 3)-1<$limiteSuperior){
    //             $segundoValor= ceil(($valor-$limiteSuperior )/ 2);
    //             $primerValor=$valor-$segundoValor-$limiteSuperior;
    //             $numeros=[$primerValor,$segundoValor,$limiteSuperior];
    //             return $numeros;
    //         }else if(ceil($valor / 4)-1<$limiteSuperior){
    //             $vuelta=2;
    //             $segundoValor= ceil(($valor-$limiteSuperior*$vuelta)/ 2);
    //             $primerValor=$valor-$segundoValor-$limiteSuperior*$vuelta;
    //             $numeros=[$primerValor,$segundoValor];
    //             for ($i=0; $i < $vuelta; $i++) { $numeros[]=$limiteSuperior;}
    //             return $numeros;
    //         }else if(ceil($valor / 5)-1<$limiteSuperior){
    //             $vuelta=3;
    //             $segundoValor= ceil(($valor-$limiteSuperior*$vuelta)/ 2);
    //             $primerValor=$valor-$segundoValor-$limiteSuperior*$vuelta;
    //             $numeros=[$primerValor,$segundoValor];
    //             for ($i=0; $i < $vuelta; $i++) { $numeros[]=$limiteSuperior;}
    //             return $numeros;
    //         }else if(ceil($valor / 6)-1<$limiteSuperior){
    //             $vuelta=4;
    //             $segundoValor= ceil(($valor-$limiteSuperior*$vuelta)/ 2);
    //             $primerValor=$valor-$segundoValor-$limiteSuperior*$vuelta;
    //             $numeros=[$primerValor,$segundoValor];
    //             for ($i=0; $i < $vuelta; $i++) { $numeros[]=$limiteSuperior;}
    //             return $numeros;
    //         }else if(ceil($valor / 7)-1<$limiteSuperior){
    //             $vuelta=5;
    //             $segundoValor= ceil(($valor-$limiteSuperior*$vuelta)/ 2);
    //             $primerValor=$valor-$segundoValor-$limiteSuperior*$vuelta;
    //             $numeros=[$primerValor,$segundoValor];
    //             for ($i=0; $i < $vuelta; $i++) { $numeros[]=$limiteSuperior;}
    //             return $numeros;
    //         }else if(ceil($valor / 8)-1<$limiteSuperior){
    //             $vuelta=6;
    //             $segundoValor= ceil(($valor-$limiteSuperior*$vuelta)/ 2);
    //             $primerValor=$valor-$segundoValor-$limiteSuperior*$vuelta;
    //             $numeros=[$primerValor,$segundoValor];
    //             for ($i=0; $i < $vuelta; $i++) { $numeros[]=$limiteSuperior;}
    //             return $numeros;
    //         }
    //         return $numeros;
    //     }
    //     function getSeries($array,$carriles){
    //         $obj=[];
    //         $sizeArray=count($array);
    //         $series=descomponerValor($sizeArray,$carriles);
    //         $serie=0;
    //         $contadorSerie=0;
    //         $contador=1;
    //         foreach ($array as $key => $nad) {
    //             if($sizeArray<=$carriles){    
    //                 // $obj[$serie]=$array;
    //                 $nad["carril"]=$contador;
    //                 $obj[$serie]["Nadadores"][]=$nad;
    //             }else{
    //                 // return $series;
    //                 if($contadorSerie<$series[$serie]){
    //                     $nad["carril"]=$contador;
    //                     $obj[$serie]["Nadadores"][]=$nad;
    //                 }else{
    //                     $serie++;
    //                     $contadorSerie=0;
    //                     $contador=1;
    //                     $nad["carril"]=$contador;
    //                     $obj[$serie]["Nadadores"][]=$nad;
    //                 }
    //                 $contadorSerie++;
    //             }
    //             $contador++;
    //         }
    //         return $obj;
    //     }
    //     function getMetrosPrueba($string){
    //         $Pruebas=[
    //             "Espalda25"=>"25Esp",
    //             "Libre25"=>"25Lib",
    //             "Pecho25"=>"25Pech",
    //             "Mariposa25"=>"25Mari",
    //             "Espalda50"=>"50Esp",
    //             "Libre50"=>"50Lib",
    //             "Pecho50"=>"50Pech",
    //             "Mariposa50"=>"50Mari",
    //             "CI100"=>"100CI",
    //             "PR_L"=>"PR_L",
    //             "PR_E"=>"PR_E",
    //         ];
    //         foreach ($Pruebas as $keyPr => $valueCat) {
    //             if($string==$keyPr){
    //                 return $valueCat;
    //             }
    //         }
    //     }
    //     function getObjetoMetrosPrueba($string){
    //         $Pruebas=[
    //             "Espalda25"=>["Prueba"=>"Espalda","Metros"=>"25 Metros"],
    //             "Libre25"=>["Prueba"=>"Libre","Metros"=>"25 Metros"],
    //             "Pecho25"=>["Prueba"=>"Pecho","Metros"=>"25 Metros"],
    //             "Mariposa25"=>["Prueba"=>"Mariposa","Metros"=>"25 Metros"],
    //             "Espalda50"=>["Prueba"=>"Espalda","Metros"=>"50 Metros"],
    //             "Libre50"=>["Prueba"=>"Libre","Metros"=>"50 Metros"],
    //             "Pecho50"=>["Prueba"=>"Pecho","Metros"=>"50 Metros"],
    //             "Mariposa50"=>["Prueba"=>"Mariposa","Metros"=>"50 Metros"],
    //             "CI100"=>["Prueba"=>"CI","Metros"=>"100 Metros"],
    //             "PR_L"=>["Prueba"=>"PR_L","Metros"=>"25 Metros"],
    //             "PR_E"=>["Prueba"=>"PR_E","Metros"=>"25 Metros"],
    //         ];
    //         foreach ($Pruebas as $keyPr => $valueCat) {
    //             if($string==$keyPr){
    //                 return $valueCat;
    //             }
    //         }
    //     }
    //     function getTiempo($nadador){
    //         $array=SqlService::selectData("tiempos",
    //         ["tiempos.*"],
    //         ["cedula"=>$nadador["Cedula"],"metros"=>$nadador["Metros"],"prueba"=>$nadador["Prueba"]],null,"tiempo");
    //         if(count($array)>0){
    //             return $array[0]["tiempo"];
    //         }else{
    //             return "";
    //         }
    //     }
    //     function cmp($a, $b) {
    //         // Ordenar por prueba
    //         $pruebaOrden = array(
    //             'PR_E' => 1,
    //             '25Esp' => 2,
    //             '50Esp' => 3,
    //             'PR_L' => 4,
    //             '25Lib' => 5,
    //             '50Lib' => 6,
    //             '100CI' => 7,
    //             '25Mari' => 8,
    //             '50Mari' => 9,
    //             '25Pech' => 10,
    //             '50Pech' => 11,
    //         );
    //         $pruebaA = $pruebaOrden[$a['Prueba']];
    //         $pruebaB = $pruebaOrden[$b['Prueba']];
        
    //         if ($pruebaA !== $pruebaB) {
    //             return $pruebaA - $pruebaB;
    //         }
        
    //         // Si las pruebas son iguales, ordenar por categoría
    //         $categoriaOrden = array(
    //             '2004-2005' => 7,
    //             '2006-2007' => 6,
    //             '2008-2009' => 5,
    //             '2010-2011' => 4,
    //             '2012-2013' => 3,
    //             '2014-2015' => 2,
    //             '2016-2017' => 1
    //         );
    //         $categoriaA = $categoriaOrden[$a['Categoria']];
    //         $categoriaB = $categoriaOrden[$b['Categoria']];
        
    //         if ($categoriaA !== $categoriaB) {
    //             return $categoriaA - $categoriaB;
    //         }
        
    //         // Si las categorías son iguales, ordenar por género
    //         $generoOrden = array(
    //             'F' => 1,
    //             'M' => 2
    //         );
    //         $generoA = $generoOrden[$a['Genero']];
    //         $generoB = $generoOrden[$b['Genero']];
        
    //         if ($generoA !== $generoB) {
    //             return $generoA - $generoB;
    //         }
        
    //         // Si los géneros son iguales, ordenar por número
    //         return $a['numero'] - $b['numero'];
    //     }
      
    //     function intercalarEntidades($array) {
    //         $entidades = array(); // Un array para mantener los objetos agrupados por entidad
    //         $resultado = array(); // El nuevo array resultante
        
    //         // Agrupar los objetos por entidad
    //         foreach ($array as $objeto) {
    //             $entidad = $objeto['entidad'];
    //             if (!isset($entidades[$entidad])) {
    //                 $entidades[$entidad] = array();
    //             }
    //             $entidades[$entidad][] = $objeto;
    //         }
        
    //         // Intercalar los objetos de cada entidad en el resultado
    //         $maxCount = max(array_map('count', $entidades));
    //         for ($i = 0; $i < $maxCount; $i++) {
    //             foreach ($entidades as $entidad => $objetos) {
    //                 if (isset($objetos[$i])) {
    //                     $resultado[] = $objetos[$i];
    //                     unset($entidades[$entidad][$i]);
    //                 }
    //             }
    //         }
        
    //         return $resultado;
    //     }
    //     function organizarPorTiempoYVacios($array) {
    //         usort($array, function($a, $b) {
    //             // Si uno de los tiempos es vacío, colócalo primero
    //             if ($a['tiempo'] === '') {
    //                 return -1;
    //             } elseif ($b['tiempo'] === '') {
    //                 return 1;
    //             }
        
    //             // Compara los tiempos como strings
    //             return strcmp($b['tiempo'], $a['tiempo']);
    //         });
        
    //         return $array;
    //     }

    //     $Competencia=[];
    //     $array=SqlService::selectData("institucion_nadador 
    //     INNER JOIN nadador ON nadador.cedula=institucion_nadador.id_nadador 
    //     INNER JOIN competencia ON competencia.id=institucion_nadador.id_competencia 
    //     INNER JOIN institucion ON institucion.id=institucion_nadador.id_institucion
    //     ",
    //     ["institucion.nombre AS entidad","nadador.cedula","nadador.genero","nadador.fecha_nacimiento","Concat(nadador.nombres,' ',nadador.apellidos) AS nadador","institucion_nadador.*"],
    //     ["id_competencia"=>$data->IdCompetencia],null,"CAST(SUBSTRING_INDEX(institucion_nadador.categoria, '-', 1) AS SIGNED) DESC");
    //     $contador=1;
    //     $arrayEventosGenerales=null;

    //     //este foreach crea los eventos pero todo en ovbetos

    //     foreach ($array as $clave => $valor) {
    //         $objPruebas = json_decode($valor["configCheck"]);
    //         foreach ($objPruebas as $key => $value) {
    //             if($value!=''){
    //                 $arrayTime=[];
    //                 $arrayTime=getObjetoMetrosPrueba($key);
    //                 $arrayTime["Cedula"]=$valor["cedula"];
    //                 $valor["tiempo"]=getTiempo($arrayTime);
                    
    //                 $eventos[$key."||".getCategoria($valor["fecha_nacimiento"])."||".$valor["genero"]][]=$valor;
    //                 $arrayEventosGenerales=$eventos;
    //             }
    //         }
    //         $contador++;
    //     }

    //      // Función de comparación para ordenar por tiempo
    //      $arrayDistribucion=[];
    //      foreach ($arrayEventosGenerales as $clave => $valor) {
    //          $arrayDistribucion[$clave] = organizarPorTiempoYVacios($valor);
    //      }
        
    //      //este foreach ya me organizar en arrays con objetos
    //     $contador=1;
    //     foreach ($arrayDistribucion as $clave => $valor) {
    //         $opciones=explode("||",$clave);
    //         // $respuesta= $opciones[0];
    //         $evento=[
    //             "Numero"=>$contador,
    //             "Prueba"=>getMetrosPrueba($opciones[0]),
    //             "Genero"=>$opciones[2],
    //             "Categoria"=>$opciones[1],
    //             "Series"=>getSeries($valor,5),
    //         ];
    //         $Competencia[]=$evento;
    //         $contador++;
    //     }

    //     //funcion que me organizar por pruebas y categorias
    //     usort($Competencia, 'cmp');

    //     // este es para crear la competencia
    //     if($data->Create){
    //         $contador=1;
    //         foreach ($Competencia as $clave => $valor) {
    //             $idEvento=SqlService::saveData("evento",(object)["id_competencia"=>$data->IdCompetencia,"numero"=>$contador,"prueba"=>$valor["Prueba"],"categoria"=>$valor["Categoria"],"genero"=>$valor["Genero"]]);
    //             $contadorSerie=1;
    //             foreach ($valor["Series"] as $keySerie => $valueSerie) {
    //                 foreach ($valueSerie["Nadadores"] as $keyNadador => $valueNad) {
    //                     SqlService::saveData("serie",(object)["id_evento"=>$idEvento,"numero"=>$contadorSerie,"carril"=>$valueNad["carril"],"cedula"=>$valueNad["cedula"],
    //                     "nadador"=>$valueNad["nadador"],"id_institucion"=>$valueNad["id_institucion"]]);
    //                 }
    //                 $contadorSerie++;
    //             }
    //             $contador++;
    //         }
    //     }
    //     // // Este es para saber en que carril estuvo cada nadador
    //     // function orgCarril($array,$camposOcupados,$limite) {
    //     //     $result=0;
    //     //     $inicio=0;
    //     //     $fin=0;

    //     //     if($limite==3){
    //     //         $inicio=2;
    //     //         $fin=4;
    //     //     }else
    //     //     if($limite==4){
    //     //         $inicio=1;
    //     //         $fin=4;
    //     //     }else
    //     //     if($limite==5){
    //     //         $inicio=1;
    //     //         $fin=5;
    //     //     }
        
    //     //     return $result;
    //     // }


    //     // $respuesta=$Competencia;
    //     function orgCarril($array, $camposOcupados, $limite) {
    //         $inicio = 1;
    //         $fin = $limite;

    //         if ($limite <= 3) {
    //             $inicio = 2;
    //             $fin = 4;
    //         } else if ($limite == 4) {
    //             $inicio = 1;
    //             $fin = $limite;
    //         } else if ($limite == 5) {
    //             $inicio = 1;
    //             $fin = $limite;
    //         }


    //         $result = findUnusedNumberInRange($inicio, $fin, $array, $camposOcupados,$array[0]);
    //         // if($result==null)$result=findUnusedNumberInRange(1, 5, $array, $camposOcupados,$array[0]);
    //         return $result;
    //     }

    //     function findUnusedNumberInRange($inicio, $fin, $array, $camposOcupados,$posicion) {
    //         if(count($array)>0){
    //             if(count($camposOcupados)>0){
    //                 if(count($array)<2){
    //                     if (!in_array($array[count($array)-1]+1, $array)) {
    //                         if($array[count($array)-1]+1>$fin){
    //                             if(!in_array($inicio, $camposOcupados)){
    //                                 // if (!in_array($inicio+1, $camposOcupados)) {
    //                                 //     return $inicio+1;
    //                                 // }
    //                                 return $inicio;
    //                             }
    //                         }
    //                         return $array[count($array)-1]+1;
    //                     }
    //                     // return 50;
            
            
    //                     // for ($i = $inicio; $i <= $fin; $i++) {
    //                     //     if(in_array($i, $camposOcupados)){
                                
    //                     //         return $i;
    //                     //     }
    //                     // }

    //                 }
                    
    //             }else{

    //             }
    //             // if(count($array)==2){
    //             //     if (!in_array($array[count($array)-1]+1, $array)) {
    //             //         if($array[count($array)-1]+1>$fin){
    //             //             if(!in_array($inicio, $camposOcupados)){
    //             //                 if (!in_array($inicio+1, $camposOcupados)) {
    //             //                     return $inicio+1;
    //             //                 }
    //             //                 return $inicio;
    //             //             }
    //             //         }
    //             //         if(!in_array($array[count($array)-1]+1, $array)){
    //             //             return 1000;
    //             //         }
    //             //     }
    //             // }
    //             return 10;
    //         }else{
    //             return 30;
    //         }

    //     }


    //     $InfoCarriles=[];
    //     $arrayCarrilesEnlosqueahestadoelnadador=[];
    //     $respuesta=0;

    //     foreach ($Competencia as $clave => $evento) {
    //         $contadorSerie=0;
    //         foreach ($evento["Series"] as $keySerie => $valueSerie) {
    //             $carrilesOcupados=[];
    //             $contNad=0;


    //             foreach ($valueSerie["Nadadores"] as $keyNadador => $valueNad) {

    //                 $condicionCarril=count($valueSerie["Nadadores"])<=3?$valueNad["carril"]+1:$valueNad["carril"];

                    
    //                 // $InfoCarriles[$valueNad["cedula"]]["Carriles"]=agregarNumeroSiNoExiste($carrilesOcupados, 5, $condicionCarril);
    //                 // $InfoCarriles[$valueNad["cedula"]]["Carril"]=$condicionCarril;
    //                 // array_push($carrilesOcupados,$condicionCarril)

                    
                  
    //                 // $respuesta[$valueNad["cedula"]][]=1;

                    
    //                 !isset($InfoCarriles[$valueNad["cedula"]]["CarrilesRecorridos"])?array_push($carrilesOcupados,$condicionCarril):array_push($carrilesOcupados,1);


    //                isset($InfoCarriles[$valueNad["cedula"]]["CarrilesRecorridos"])?
    //                $InfoCarriles[$valueNad["cedula"]]["CarrilesRecorridos"][]=$condicionCarril=orgCarril($InfoCarriles[$valueNad["cedula"]]["CarrilesRecorridos"],$InfoCarriles[$valueNad["cedula"]]["CarrilesRecorridos"] ,count($valueSerie["Nadadores"])):
    //                $InfoCarriles[$valueNad["cedula"]]["CarrilesRecorridos"][]=$condicionCarril;
    //             //    isset($InfoCarriles[$valueNad["cedula"]]["CarrilesOcupados"])?
    //             //    $InfoCarriles[$valueNad["cedula"]]["CarrilesOcupados"][]=$condicionCarril=orgCarril($InfoCarriles[$valueNad["cedula"]]["CarrilesRecorridos"],$carrilesOcupados,count($valueSerie["Nadadores"])):
    //             //    $InfoCarriles[$valueNad["cedula"]]["CarrilesOcupados"][]=$condicionCarril;
    //                 $InfoCarriles[$valueNad["cedula"]]["Evento"]=$evento["Prueba"].$evento["Categoria"].$evento["Genero"];
    //                 $InfoCarriles[$valueNad["cedula"]]["Serie"]=$contadorSerie;
    //                 $InfoCarriles[$valueNad["cedula"]]["CantidadNadadores"]=count($valueSerie["Nadadores"]);
    //                 $InfoCarriles[$valueNad["cedula"]]["NumeroEvento"]=$clave;
    //                 $InfoCarriles[$valueNad["cedula"]]["Nadador"]=$contNad;
    //                 $InfoCarriles[$valueNad["cedula"]]["Nombres"]=$valueNad["nadador"];
    //                 $contNad++;

    //             }
    //             $contadorSerie++;

    //         }
    //     }
    //     // $arrayFinal=[];

    //     foreach ($Competencia as $clave => $evento) {
    //         $contadorSerie=1;
    //         foreach ($evento["Series"] as $keySerie => $valueSerie) {
    //             $carrilesOcupados=[];

    //             foreach ($valueSerie["Nadadores"] as $keyNadador => $valueNad) {

    //                 $Competencia[$clave]["Series"][$keySerie]["Nadadores"][$keyNadador]["carril"]=$InfoCarriles[$valueNad["cedula"]]["CarrilesRecorridos"][0];
    //                 array_shift($InfoCarriles[$valueNad["cedula"]]["CarrilesRecorridos"]);
    //             }
    //             $contadorSerie++;

    //         }
    //     }
    //     $respuesta=$Competencia;

    //     function ordenarPorCarrilEnSeries($arrayDeObjetos) {
    //         foreach ($arrayDeObjetos as $serie) {
    //             if (isset($serie->Series[0]->Nadadores) && is_array($serie->Series[0]->Nadadores)) {
    //                 usort($serie->Series[0]->Nadadores, function($a, $b) {
    //                     return $a->carril - $b->carril;
    //                 });
    //             }
    //         }
        
    //         usort($arrayDeObjetos, function($a, $b) {
    //             $primerCarrilA = isset($a->Series[0]->Nadadores[0]) ? $a->Series[0]->Nadadores[0]->carril : PHP_INT_MAX;
    //             $primerCarrilB = isset($b->Series[0]->Nadadores[0]) ? $b->Series[0]->Nadadores[0]->carril : PHP_INT_MAX;
        
    //             return $primerCarrilA - $primerCarrilB;
    //         });
        
    //         return $arrayDeObjetos;
    //     }


    //     // $cambiar = ordenarPorCarrilEnSeries($Competencia);
    //     // $Competencia=$cambiar;
    //     $dede=[];

    //     // for ($i=54; $i < count($Competencia); $i++) { 
    //     //     $dede[]=$Competencia[$i];
    //     //     foreach ($Competencia[0]["Series"] as $keySerie => $valueSerie) {
    //     //         $dede[]["Series"][]=$valueSerie;
    //     //         foreach ($valueSerie["Nadadores"] as $keyNadador => $valueNad) {
    //     //             $dede[]["Series"][]["Nadadores"][]=$valueNad;
    //     //         }
    //     //     }
    //     // }

    //     // Ejemplo de uso:
    //     $serie = array(
    //         (object) array(
    //             'Series' => array(
    //                 (object) array(
    //                     'Nadadores' => array(
    //                         (object) array('cedula' =>1104661598,'tiempo' => 60.5, 'carril' => 1, 'prev_carriles' => array(1), 'eventos' => array(1)),
    //                         (object) array('cedula' =>1104661599,'tiempo' => 59.8, 'carril' => 2, 'prev_carriles' => array(2), 'eventos' => array(1)),
    //                         (object) array('cedula' =>1104661597,'tiempo' => 61.2, 'carril' => 3, 'prev_carriles' => array(3), 'eventos' => array(1)),
    //                     ),
    //                 ),
    //             ),
    //         ),
        
    //         (object) array(
    //             'Series' => array(
    //                 (object) array(
    //                     'Nadadores' => array(
    //                         (object) array('cedula' =>1104661598,'tiempo' => 60.5, 'carril' => 1, 'prev_carriles' => array(1), 'eventos' => array(1, 2)),
    //                         (object) array('cedula' =>1104661599,'tiempo' => 59.8, 'carril' => 2, 'prev_carriles' => array(2), 'eventos' => array(1, 2)),
    //                         (object) array('cedula' =>1104661597,'tiempo' => 61.2, 'carril' => 3, 'prev_carriles' => array(3), 'eventos' => array(1, 2)),
    //                     ),
    //                 ),
    //             ),
    //         ),
    //         (object) array(
    //             'Series' => array(
    //                 (object) array(
    //                     'Nadadores' => array(
    //                         (object) array('cedula' =>1104661598,'tiempo' => 60.5, 'carril' => 1, 'prev_carriles' => array(1), 'eventos' => array(1, 2, 3)),
    //                         (object) array('cedula' =>1104661599,'tiempo' => 59.8, 'carril' => 2, 'prev_carriles' => array(2), 'eventos' => array(1, 2, 3)),
    //                         (object) array('cedula' =>1104661597,'tiempo' => 61.2, 'carril' => 3, 'prev_carriles' => array(3), 'eventos' => array(1, 2, 3)),
    //                     ),
    //                 ),
    //             ),
    //         ),
    //     );
        

    //     Flight::json($respuesta);
    // }
    public static function administrarCompetencia(){
        $respuesta=false;
        $data = json_decode(Flight::request()->getBody());

        function getCategoria($stringDate){
            $Categorias=[
                "2004-2005"=>[2004,2005],
                "2006-2007"=>[2006,2007],
                "2008-2009"=>[2008,2009],
                "2010-2011"=>[2010,2011],
                "2012-2013"=>[2012,2013],
                "2014-2015"=>[2014,2015],
                "2016-2017"=>[2016,2017],
            ];
            $div=explode("-",$stringDate);
            $CatAnio=intval($div[2]);
            foreach ($Categorias as $keyCat => $valueCat) {
                foreach ($valueCat as $keyAnio => $valueAnio) {
                    if($CatAnio==$valueAnio){
                        return $keyCat;
                    }
                }
            }
        }
        function descomponerValor($valor, $limiteSuperior) {
            $numeros = array();
            if(ceil($valor / 2)<=$limiteSuperior){
                $primerValor=ceil($valor / 2);
                $segundoValor=$valor-$primerValor;
                $numeros=[$segundoValor,$primerValor];
                return $numeros;
            }else if(ceil($valor / 3)-1<$limiteSuperior){
                $segundoValor= ceil(($valor-$limiteSuperior )/ 2);
                $primerValor=$valor-$segundoValor-$limiteSuperior;
                $numeros=[$primerValor,$segundoValor,$limiteSuperior];
                return $numeros;
            }else if(ceil($valor / 4)-1<$limiteSuperior){
                $vuelta=2;
                $segundoValor= ceil(($valor-$limiteSuperior*$vuelta)/ 2);
                $primerValor=$valor-$segundoValor-$limiteSuperior*$vuelta;
                $numeros=[$primerValor,$segundoValor];
                for ($i=0; $i < $vuelta; $i++) { $numeros[]=$limiteSuperior;}
                return $numeros;
            }else if(ceil($valor / 5)-1<$limiteSuperior){
                $vuelta=3;
                $segundoValor= ceil(($valor-$limiteSuperior*$vuelta)/ 2);
                $primerValor=$valor-$segundoValor-$limiteSuperior*$vuelta;
                $numeros=[$primerValor,$segundoValor];
                for ($i=0; $i < $vuelta; $i++) { $numeros[]=$limiteSuperior;}
                return $numeros;
            }else if(ceil($valor / 6)-1<$limiteSuperior){
                $vuelta=4;
                $segundoValor= ceil(($valor-$limiteSuperior*$vuelta)/ 2);
                $primerValor=$valor-$segundoValor-$limiteSuperior*$vuelta;
                $numeros=[$primerValor,$segundoValor];
                for ($i=0; $i < $vuelta; $i++) { $numeros[]=$limiteSuperior;}
                return $numeros;
            }else if(ceil($valor / 7)-1<$limiteSuperior){
                $vuelta=5;
                $segundoValor= ceil(($valor-$limiteSuperior*$vuelta)/ 2);
                $primerValor=$valor-$segundoValor-$limiteSuperior*$vuelta;
                $numeros=[$primerValor,$segundoValor];
                for ($i=0; $i < $vuelta; $i++) { $numeros[]=$limiteSuperior;}
                return $numeros;
            }else if(ceil($valor / 8)-1<$limiteSuperior){
                $vuelta=6;
                $segundoValor= ceil(($valor-$limiteSuperior*$vuelta)/ 2);
                $primerValor=$valor-$segundoValor-$limiteSuperior*$vuelta;
                $numeros=[$primerValor,$segundoValor];
                for ($i=0; $i < $vuelta; $i++) { $numeros[]=$limiteSuperior;}
                return $numeros;
            }
            return $numeros;
        }
        function getSeries($array,$carriles){
            $obj=[];
            $sizeArray=count($array);
            $series=descomponerValor($sizeArray,$carriles);
            $serie=0;
            $contadorSerie=0;
            $contador=1;
            foreach ($array as $key => $nad) {
                if($sizeArray<=$carriles){    
                    // $obj[$serie]=$array;
                    $nad["carril"]=$contador;
                    $obj[$serie]["Nadadores"][]=$nad;
                }else{
                    // return $series;
                    if($contadorSerie<$series[$serie]){
                        $nad["carril"]=$contador;
                        $obj[$serie]["Nadadores"][]=$nad;
                    }else{
                        $serie++;
                        $contadorSerie=0;
                        $contador=1;
                        $nad["carril"]=$contador;
                        $obj[$serie]["Nadadores"][]=$nad;
                    }
                    $contadorSerie++;
                }
                $contador++;
            }
            return $obj;
        }
        function getMetrosPrueba($string){
            $Pruebas=[
                "Espalda25"=>"25Esp",
                "Libre25"=>"25Lib",
                "Pecho25"=>"25Pech",
                "Mariposa25"=>"25Mari",
                "Espalda50"=>"50Esp",
                "Libre50"=>"50Lib",
                "Pecho50"=>"50Pech",
                "Mariposa50"=>"50Mari",
                "CI100"=>"100CI",
                "PR_L"=>"PR_L",
                "PR_E"=>"PR_E",
            ];
            foreach ($Pruebas as $keyPr => $valueCat) {
                if($string==$keyPr){
                    return $valueCat;
                }
            }
        }
        function getObjetoMetrosPrueba($string){
            $Pruebas=[
                "Espalda25"=>["Prueba"=>"Espalda","Metros"=>"25 Metros"],
                "Libre25"=>["Prueba"=>"Libre","Metros"=>"25 Metros"],
                "Pecho25"=>["Prueba"=>"Pecho","Metros"=>"25 Metros"],
                "Mariposa25"=>["Prueba"=>"Mariposa","Metros"=>"25 Metros"],
                "Espalda50"=>["Prueba"=>"Espalda","Metros"=>"50 Metros"],
                "Libre50"=>["Prueba"=>"Libre","Metros"=>"50 Metros"],
                "Pecho50"=>["Prueba"=>"Pecho","Metros"=>"50 Metros"],
                "Mariposa50"=>["Prueba"=>"Mariposa","Metros"=>"50 Metros"],
                "CI100"=>["Prueba"=>"CI","Metros"=>"100 Metros"],
                "PR_L"=>["Prueba"=>"PR_L","Metros"=>"25 Metros"],
                "PR_E"=>["Prueba"=>"PR_E","Metros"=>"25 Metros"],
            ];
            foreach ($Pruebas as $keyPr => $valueCat) {
                if($string==$keyPr){
                    return $valueCat;
                }
            }
        }
        function getTiempo($nadador){
            $array=SqlService::selectData("tiempos",
            ["tiempos.*"],
            ["cedula"=>$nadador["Cedula"],"metros"=>$nadador["Metros"],"prueba"=>$nadador["Prueba"]],null,"tiempo");
            if(count($array)>0){
                return $array[0]["tiempo"];
            }else{
                return "";
            }
        }
        function cmp($a, $b) {
            // Ordenar según tu criterio personalizado
            $ordenPersonalizado = array(
                'PR_E-2016-2017' => 1,
                'PR_E-2014-2015' => 2,
                '25Esp-2012-2013' => 3,
                '50Esp-2010-2011' => 4,
                '50Esp-2008-2009' => 5,
                '50Esp-2006-2007' => 6,
                '50Esp-2004-2005' => 7,

                'PR_L-2016-2017' => 8,
                'PR_L-2014-2015' => 9,
                '25Lib-2012-2013' => 10,
                '50Lib-2010-2011' => 11,
                '50Lib-2008-2009' => 12,
                '50Lib-2006-2007' => 13,
                '50Lib-2004-2005' => 14,


                '25Esp-2016-2017' => 15,
                '25Esp-2014-2015' => 16,
                '100CI-2012-2013' => 17,
                '100CI-2010-2011' => 18,
                '100CI-2008-2009' => 19,
                '100CI-2006-2007' => 20,
                '100CI-2004-2005' => 21,
                '25Lib-2016-2017' => 22,
                '25Lib-2014-2015' => 23,

                // 'PR_L-2016-2017' => 28,
                // 'PR_L-2014-2015' => 29,
                '25Mari-2012-2013' => 30,
                '50Mari-2010-2011' => 31,
                '50Mari-2008-2009' => 32,
                '50Mari-2006-2007' => 33,
                '50Mari-2004-2005' => 34,

                '25Pech-2012-2013' => 35,
                '50Pech-2010-2011' => 36,
                '50Pech-2008-2009' => 37,
                '50Pech-2006-2007' => 38,
                '50Pech-2004-2005' => 39,





            );
        
            $claveA = $a['Prueba'] . '-' . $a['Categoria'];
            $claveB = $b['Prueba'] . '-' . $b['Categoria'];
        
            $posicionA = $ordenPersonalizado[$claveA] ?? PHP_INT_MAX;
            $posicionB = $ordenPersonalizado[$claveB] ?? PHP_INT_MAX;
        
            if ($posicionA !== $posicionB) {
                return $posicionA - $posicionB;
            }
        
            // Si los elementos tienen la misma posición en el orden personalizado, ordenar por género
            $generoOrden = array(
                'F' => 1,
                'M' => 2
            );
            $generoA = $generoOrden[$a['Genero']];
            $generoB = $generoOrden[$b['Genero']];
        
            return $generoA - $generoB;
        }
        
        
        
        
      
        function intercalarEntidades($array) {
            $entidades = array(); // Un array para mantener los objetos agrupados por entidad
            $resultado = array(); // El nuevo array resultante
        
            // Agrupar los objetos por entidad
            foreach ($array as $objeto) {
                $entidad = $objeto['entidad'];
                if (!isset($entidades[$entidad])) {
                    $entidades[$entidad] = array();
                }
                $entidades[$entidad][] = $objeto;
            }
        
            // Intercalar los objetos de cada entidad en el resultado
            $maxCount = max(array_map('count', $entidades));
            for ($i = 0; $i < $maxCount; $i++) {
                foreach ($entidades as $entidad => $objetos) {
                    if (isset($objetos[$i])) {
                        $resultado[] = $objetos[$i];
                        unset($entidades[$entidad][$i]);
                    }
                }
            }
        
            return $resultado;
        }
        function organizarPorTiempoYVacios($array) {
            usort($array, function($a, $b) {
                // Si uno de los tiempos es vacío, colócalo primero
                if ($a['tiempo'] === '') {
                    return -1;
                } elseif ($b['tiempo'] === '') {
                    return 1;
                }
        
                // Compara los tiempos como strings
                return strcmp($b['tiempo'], $a['tiempo']);
            });
        
            return $array;
        }

        $Competencia=[];
        $array=SqlService::selectData("institucion_nadador 
        INNER JOIN nadador ON nadador.cedula=institucion_nadador.id_nadador 
        INNER JOIN competencia ON competencia.id=institucion_nadador.id_competencia 
        INNER JOIN institucion ON institucion.id=institucion_nadador.id_institucion
        ",
        ["institucion.nombre AS entidad","nadador.cedula","nadador.genero","nadador.fecha_nacimiento","Concat(nadador.nombres,' ',nadador.apellidos) AS nadador","institucion_nadador.*"],
        ["id_competencia"=>$data->IdCompetencia],null,"CAST(SUBSTRING_INDEX(institucion_nadador.categoria, '-', 1) AS SIGNED) DESC");
        $contador=1;
        $arrayEventosGenerales=null;

        //este foreach crea los eventos pero todo en ovbetos

        foreach ($array as $clave => $valor) {
            $objPruebas = json_decode($valor["configCheck"]);
            foreach ($objPruebas as $key => $value) {
                if($value!=''){
                    $arrayTime=[];
                    $arrayTime=getObjetoMetrosPrueba($key);
                    $arrayTime["Cedula"]=$valor["cedula"];
                    $valor["tiempo"]=getTiempo($arrayTime);
                    
                    $eventos[$key."||".getCategoria($valor["fecha_nacimiento"])."||".$valor["genero"]][]=$valor;
                    $arrayEventosGenerales=$eventos;
                }
            }
            $contador++;
        }

         // Función de comparación para ordenar por tiempo
         $arrayDistribucion=[];
         foreach ($arrayEventosGenerales as $clave => $valor) {
             $arrayDistribucion[$clave] = organizarPorTiempoYVacios($valor);
         }
        
         //este foreach ya me organizar en arrays con objetos
        $contador=1;
        foreach ($arrayDistribucion as $clave => $valor) {
            $opciones=explode("||",$clave);
            // $respuesta= $opciones[0];
            $evento=[
                "Numero"=>$contador,
                "Prueba"=>getMetrosPrueba($opciones[0]),
                "Genero"=>$opciones[2],
                "Categoria"=>$opciones[1],
                "Series"=>getSeries($valor,5),
            ];
            $Competencia[]=$evento;
            $contador++;
        }

        //funcion que me organizar por pruebas y categorias
        usort($Competencia, 'cmp');

        // este es para crear la competencia
        if($data->Create){
            $contador=1;
            foreach ($Competencia as $clave => $valor) {
                $idEvento=SqlService::saveData("evento",(object)["id_competencia"=>$data->IdCompetencia,"numero"=>$contador,"prueba"=>$valor["Prueba"],"categoria"=>$valor["Categoria"],"genero"=>$valor["Genero"]]);
                $contadorSerie=1;
                foreach ($valor["Series"] as $keySerie => $valueSerie) {
                    foreach ($valueSerie["Nadadores"] as $keyNadador => $valueNad) {
                        SqlService::saveData("serie",(object)["id_evento"=>$idEvento,"numero"=>$contadorSerie,"carril"=>$valueNad["carril"],"cedula"=>$valueNad["cedula"],
                        "nadador"=>$valueNad["nadador"],"id_institucion"=>$valueNad["id_institucion"]]);
                    }
                    $contadorSerie++;
                }
                $contador++;
            }
        }

        $arraySeriesGlobal=[];
        $arrayNadadoresGlobal=[];

        foreach ($Competencia as $clave => $evento) {
            foreach ($evento["Series"] as $keySerie => $valueSerie) {
                $arraySeriesGlobal[]["Evento".($clave+1)."Serie".($keySerie+1)]=$valueSerie["Nadadores"];
                    shuffle($valueSerie["Nadadores"]);
                foreach ($valueSerie["Nadadores"] as $keyNadador => $valueNad) {

                    // $arrayNadadoresGlobal[$valueNad["cedula"]]=$valueNad;
                    // $arrayNadadoresGlobal[$valueNad["cedula"]]["carriles"]=[];
                    // $arrayNadadoresGlobal[$valueNad["cedula"]]["carrilAnterior"]=isset($arrayNadadoresGlobal[$valueNad["cedula"]]["carrilInicial"])?:$valueNad["carril"];
                    // $arrayNadadoresGlobal[$valueNad["cedula"]]["carrilInicial"]=isset($arrayNadadoresGlobal[$valueNad["cedula"]]["carrilInicial"])?:$valueNad["carril"];
                    // $arrayNadadoresGlobal[$valueNad["cedula"]]["compitio"]=false;
                    // $arrayNadadoresGlobal[$valueNad["cedula"]]["numeroEvento"]=$clave;
                    // $arrayNadadoresGlobal[$valueNad["cedula"]]["numeroSerie"]=$keySerie;
                    // $arrayNadadoresGlobal[$valueNad["cedula"]]["numeroNadador"]=$keyNadador;
                }
            }
        }
        // foreach ($arraySeriesGlobal as $key => $eventoSerie) {
        //     foreach ($eventoSerie as $keyNad => $serie) {
        //         $carrilesOcupados=[];
        //         foreach ($serie as $nad) {
        //             $cedula = $nad["cedula"];
        //             $nadador=$arrayNadadoresGlobal[$cedula];
        //             if (isset($nadador) && !$nadador["compitio"]) {
                        
        //                 array_push($nadador["carriles"], $nadador["carrilInicial"]);
        //                 $nadador["compitio"] = true;
        //                 // $carril=
        //             }else{
        //                 for ($i=1; $i < count($serie)+1; $i++) { 
        //                     if(!in_array($i, $carrilesOcupados)){
                                
        //                         if(!in_array($i, $nadador["carriles"])){
        //                             array_push($nadador["carriles"], $i);
        //                             array_push($carrilesOcupados, $i);
        //                             // $Competencia[$nadador["numeroEvento"]]["Series"][$nadador["numeroSerie"]]["Nadadores"][$nadador["numeroNadador"]]["carril"]=34;
        //                         }

        //                     }
        //                 }
        //             }
        //         }
        //     }
        // }
        function alternarPosicionesNadadores($competencia) {
            foreach ($competencia as &$evento) {
                foreach ($evento['Series'] as &$serie) {
                    // Obtén el array de nadadores de la serie
                    $nadadores = $serie['Nadadores'];
        
                    // Reorganiza aleatoriamente las posiciones de los nadadores
                    shuffle($nadadores);
        
                    // Asigna el nuevo orden de nadadores a la serie
                    $serie['Nadadores'] = $nadadores;
                }
            }
        
            return $competencia;
        }
        
        $Competencia = alternarPosicionesNadadores($Competencia);
        

        
        $respuesta=$Competencia;
        Flight::json($respuesta);
    }


    public static function getCompetenciaTiempos(){
        $respuesta=false;
        $data = json_decode(Flight::request()->getBody());

        $Competencia=[];

        $array=SqlService::selectData("serie 
        INNER JOIN evento ON evento.id = serie.id_evento 
        INNER JOIN competencia ON competencia.id=evento.id_competencia
        INNER JOIN institucion ON institucion.id=serie.id_institucion
        ",
        ["evento.*","serie.numero AS numeroSerie","serie.cedula","serie.carril","serie.tiempo","serie.nadador","institucion.nombre AS entidad","serie.id AS idTiempo","serie.descalificado","serie.premiado","serie.lugar"],
        ["id_competencia"=>$data->IdCompetencia],null,null);

        $contador=1;
        foreach ($array as $clave => $valor) {

            $nadador=[
                "cedula"=>$valor["cedula"],
                "tiempo"=>$valor["tiempo"] ? $valor['tiempo'] : "",
                "entidad"=>$valor["entidad"],
                "nadador"=>$valor["nadador"],
                "carril"=>$valor["carril"],
                "id"=>$valor["idTiempo"],
                "descalificado"=>$valor["descalificado"],
                "premiado"=>$valor["premiado"],
                "lugar"=>$valor["lugar"],
            ];
            if(!isset($Competencia[$valor["numero"]-1])){
                $series=[];
                $series[$valor["numeroSerie"]-1]["Nadadores"][]=$nadador;
                $Competencia[$valor["numero"]-1]=["Categoria"=>$valor["categoria"],"Genero"=>$valor["genero"],"Numero"=>$valor["numero"],"Prueba"=>$valor["prueba"],"Series"=>$series];
            }else{
                $series[$valor["numeroSerie"]-1]["Nadadores"][]=$nadador;
                $Competencia[$valor["numero"]-1]=["Categoria"=>$valor["categoria"],"Genero"=>$valor["genero"],"Numero"=>$valor["numero"],"Prueba"=>$valor["prueba"],"Series"=>$series];
            }

            
            // $Competencia[$valor["numero"]-1]=["Prueba"=>$valor["prueba"]];
      
            // $Competencia[$valor["numero"]-1]["Series"][$valor["numeroSerie"]-1]["Nadadores"][]=["cedula"=>$valor["cedula"],"tiempo"=>$valor["tiempo"],"entidad"=>$valor["entidad"]];
           
            $contador++;
        }
        $respuesta=$Competencia;
        Flight::json($respuesta);
    }
    public static function getResultados(){
        // Función de comparación personalizada
        function compararNadadores($nadador1, $nadador2) {
            // Filtrar vacíos
            if ($nadador1["tiempo"] == '' || $nadador2["tiempo"] == '') {
                return strcmp($nadador2["tiempo"], $nadador1["tiempo"]);
            }
            
            // Ordenar primero por descalificado (ascendente), luego por tiempo (ascendente)
            if ($nadador1["descalificado"] == $nadador2["descalificado"]) {
                return strcmp($nadador1["tiempo"], $nadador2["tiempo"]);
            }
        
            return $nadador1["descalificado"] - $nadador2["descalificado"];
        }
        
        $respuesta=false;
        $data = json_decode(Flight::request()->getBody());

        $Competencia=[];

        $array=SqlService::selectData("serie 
        INNER JOIN evento ON evento.id = serie.id_evento 
        INNER JOIN competencia ON competencia.id=evento.id_competencia
        INNER JOIN institucion ON institucion.id=serie.id_institucion
        ",
        ["competencia.nombre AS nombreCompetencia","evento.*","serie.numero AS numeroSerie","serie.cedula","serie.carril","serie.tiempo","serie.nadador","institucion.nombre AS entidad","serie.id AS idTiempo","serie.descalificado","serie.premiado","serie.lugar"],
        ["id_competencia"=>$data->IdCompetencia],null,null);

        foreach ($array as $clave => $valor) {

            $nadador=[
                "cedula"=>$valor["cedula"],
                "tiempo"=>$valor["tiempo"] ? $valor['tiempo'] : "",
                "entidad"=>$valor["entidad"],
                "nadador"=>$valor["nadador"],
                "carril"=>$valor["carril"],
                "id"=>$valor["idTiempo"],
                "descalificado"=>$valor["descalificado"],
                "premiado"=>$valor["premiado"],
                "lugar"=>$valor["lugar"],
            ];
            if(!isset($Competencia[$valor["numero"]-1])){
                $series=[];
                $series[]=$nadador;
                $Competencia[$valor["numero"]-1]=["Categoria"=>$valor["categoria"],"Genero"=>$valor["genero"],"Numero"=>$valor["numero"],"Prueba"=>$valor["prueba"],"Nadadores"=>$series];
            }else{
                $series[]=$nadador;
                $Competencia[$valor["numero"]-1]=["Categoria"=>$valor["categoria"],"Genero"=>$valor["genero"],"Numero"=>$valor["numero"],"Prueba"=>$valor["prueba"],"Nadadores"=>$series];
            }
        }
        foreach ($Competencia as $clave => $valor) {
            usort($Competencia[$clave]["Nadadores"], 'compararNadadores');
        }
        $entidad=[];
        $resultados=[];
        foreach ($Competencia as $key => $valor) {
            $lugar = 1;
            $ultimoTiempo = null;
            foreach ($valor["Nadadores"] as $keyNad => $value) {
                if($value["descalificado"] != 1){
                    if ($value["tiempo"] != $ultimoTiempo) {
                        $Competencia[$key]["Nadadores"][$keyNad]["lugar"] = $lugar;
                        $ultimoTiempo = $value["tiempo"];
            
                    }else{
                        $lugar--;
                        $Competencia[$key]["Nadadores"][$keyNad]["lugar"] = $lugar;
    
                    }
                }
                if ($lugar == 1 && $value["tiempo"] != ""&&$value["descalificado"] != 1)$entidad[$value["entidad"]]["oro"] = ($entidad[$value["entidad"]]["oro"] ?? 0) + 1;
                if ($lugar == 2 && $value["tiempo"] != ""&&$value["descalificado"] != 1)$entidad[$value["entidad"]]["plata"] = ($entidad[$value["entidad"]]["plata"] ?? 0) + 1;
                if ($lugar == 3 && $value["tiempo"] != ""&&$value["descalificado"] != 1)$entidad[$value["entidad"]]["bronce"] = ($entidad[$value["entidad"]]["bronce"] ?? 0) + 1;
                $lugar++;
                
            }
        }

        foreach ($entidad as $key => $valor) {

            $oro=isset($valor["oro"])?$valor["oro"]:0;
            $plata=isset($valor["plata"])?$valor["plata"]:0;
            $bronce=isset($valor["bronce"])?$valor["bronce"]:0;
            

            $resultados[]=["Entidad"=>$key,"Medallas"=>
                [
                    "Oro"=>$oro,
                    "Plata"=>$plata,
                    "Bronce"=>$bronce,
                    "OroPlata"=>$oro+$plata,
                    "OroBronce"=>$oro+$bronce,
                    "PlataBronce"=>$plata+$bronce,
                    "Total"=>$oro+$plata+$bronce,
                ]
            ];
            
        }
        function ordenarPorOroPlataYBronce($arrayDeObjetos) {
            usort($arrayDeObjetos, function($a, $b) {
                if ($b["Medallas"]["Oro"] === $a["Medallas"]["Oro"]) {
                    if ($b["Medallas"]["Plata"] === $a["Medallas"]["Plata"]) {
                        return $b["Medallas"]["Bronce"] - $a["Medallas"]["Bronce"];
                    }
                    return $b["Medallas"]["Plata"] - $a["Medallas"]["Plata"];
                }
                return $b["Medallas"]["Oro"] - $a["Medallas"]["Oro"];
            });
            return $arrayDeObjetos;
        }
        
        
        
        

        
        $respuesta=["Competencia"=>$Competencia,"Resultados"=>ordenarPorOroPlataYBronce($resultados),"Nombre"=>$array[0]["nombreCompetencia"]];
        Flight::json($respuesta);
    }



//     public static function getEntidadCompetencia(){
//         // $data = json_decode(Flight::request()->getBody());
//         $respuesta=false;
//         $arrayDistribucion=[];
//         $arrayEntidad=[];
//         $array=SqlService::selectData("institucion_nadador ",
//         [],[],null,null);


//         // ArrayChecks:{
//         //     PR_L:`checked`,PR_E:`checked`,Libre25:`checked`,Espalda25:`checked`,Pecho25:`checked`,Mariposa25:`checked`,
//         //     Libre50:`checked`,Espalda50:`checked`,Pecho50:`checked`,Mariposa50:`checked`,CI100:`checked`
//         // }


//         foreach ($array as $clave => $valor) {
//             // $arrayDistribucion[$valor["entidad"]][$valor["cedula"]]=$valor;
//             $obj = json_decode($valor["configCheck"]);
//             $objetoColegio=[
//                 "PR_L"=>"",
//                 "PR_E"=>"",
//                 "Libre25"=>"",
//                 "Espalda25"=>"",
//                 "Pecho25"=>"",
//                 "Mariposa25"=>"",
//             ];
//             $objetoEscuela=[
//                 "Libre50"=>"",
//                 "Espalda50"=>"",
//                 "Pecho50"=>"",
//                 "Mariposa50"=>"",
//             ];

//             foreach ($obj as $key => $value) {
//                 // if($valor["id_competencia"]==2){
//                 //     if($key=="Lib"){
//                 //         $objetoColegio["Libre50"]=$value;
//                 //     }
//                 //     if($key=="Esp"){
//                 //         $objetoColegio["Espalda50"]=$value;
//                 //     }
//                 //     if($key=="Pech"){
//                 //         $objetoColegio["Pecho50"]=$value;
//                 //     }
//                 //     if($key=="Mari"){
//                 //         $objetoColegio["Mariposa50"]=$value;
//                 //     }
//                 //     if($key=="CI"){
//                 //         $objetoColegio["CI100"]=$value;
//                 //     }
//                 //     $strObjetoJson = json_encode($objetoColegio);
//                 //     SqlService::editData("institucion_nadador",(object)["configCheck"=>$strObjetoJson],(object)["id_nadador"=>$valor["id_nadador"]]);
//                 // }
//                 // if($valor["id_competencia"]==1){
//                 //     if($key=="Lib"){
//                 //         $objetoEscuela["Libre25"]=$value;
//                 //     }
//                 //     if($key=="Esp"){
//                 //         $objetoEscuela["Espalda25"]=$value;
//                 //     }
//                 //     if($key=="Pech"){
//                 //         $objetoEscuela["Pecho25"]=$value;
//                 //     }
//                 //     if($key=="Mari"){
//                 //         $objetoEscuela["Mariposa25"]=$value;
//                 //     }
//                 //     if($key=="CI"){
//                 //         $objetoEscuela["CI100"]=$value;
//                 //     }
//                 //     $strObjetoJson = json_encode($objetoEscuela);
//                 //     SqlService::editData("institucion_nadador",(object)["configCheck"=>$strObjetoJson],(object)["id_nadador"=>$valor["id_nadador"]]);
//                 // }
//             }

//             $respuesta=$objetoColegio;
            
//             // SqlService::editData($data->Table,$data->Columns,$data->Conditions);
            
//             // $respuesta=$valor["id_nadador"];
//         }
       
//         // $data=(object)["Table"=>"institucion_nadador","Columns"=>(object)["configCheck"=>""],"Conditions"=>(object)["id_nadador"=>43434]];
//         // $data = (object) $arrayPrueba;
//         // SqlService::editData("institucion_nadador",$values,$condition);
//         // SqlService::editData($data->Table,$data->Columns,$data->Conditions);
//         // $respuesta=is_object($data);
        
//         Flight::json($respuesta);
//     }
}