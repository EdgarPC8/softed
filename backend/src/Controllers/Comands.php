<?php

class Comands{
    public static function createBD(){

        $mensaje = "No hay mensaje";
        $archivo = '/Applications/XAMPP/htdocs/natacion/backend/src/BD/crono_swim.db';
        
    
        // Borrar el archivo de la base de datos si existe
        if (file_exists($archivo)) {
            unlink($archivo);
        }
        // Crear o abrir la base de datos
        $conexion = new SQLite3($archivo);
        if (!$conexion) {
            $mensaje = 'No se pudo crear o abrir la base de datos. AUTOINCREMENT';
        } else {
            $insertNadador=Comands::getInsertsInto("nadador",0);
            $insertPruebas=Comands::getInsertsInto("pruebas",1);
            $insertMetros=Comands::getInsertsInto("metros",1);
            $insertTiempos=Comands::getInsertsInto("tiempos",1);
            $insertSerie=Comands::getInsertsInto("serie",1);
            $insertEvento=Comands::getInsertsInto("evento",1);
            $insertCompetencia=Comands::getInsertsInto("competencia",1);
            $insertInstitucion=Comands::getInsertsInto("institucion",1);
            $insertInstitucionNadador=Comands::getInsertsInto("institucion_nadador",1);


            // Crear la tabla usuarios
            $tablas = "
            CREATE TABLE IF NOT EXISTS pruebas (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nombre TEXT
            );
            CREATE TABLE IF NOT EXISTS metros (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                metros TEXT
            );
            CREATE TABLE IF NOT EXISTS tiempos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                cedula INTEGER,
                fecha TEXT,
                prueba TEXT,
                metros TEXT,
                tiempo TEXT
            );

            CREATE TABLE IF NOT EXISTS nadador (
                cedula INTEGER PRIMARY KEY,
                nadador TEXT,
                nombres TEXT,
                apellidos TEXT,
                fecha_nacimiento TEXT,
                genero TEXT,
                grupo INTEGER
            );
            CREATE TABLE IF NOT EXISTS cronometro (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nombre TEXT,
                metros TEXT,
                prueba TEXT,
                config TEXT,
                tiempo TEXT,
                vuelta TEXT,
                posicion INTEGER,
                cedula INTEGER
            );
            CREATE TABLE IF NOT EXISTS serie (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                id_evento INTEGER,
                numero INTEGER,
                cedula INTEGER,
                nadador TEXT,
                institucion TEXT,
                tiempo TEXT,
                descalificado INTEGER DEFAULT 0,
                puntos INTEGER,
                lugar INTEGER,
                premiado INTEGER DEFAULT 1
            );
            CREATE TABLE IF NOT EXISTS evento (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                id_competencia INTEGER,
                numero INTEGER,
                prueba TEXT,
                categoria TEXT,
                genero TEXT
            );
            CREATE TABLE IF NOT EXISTS competencia (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nombre TEXT,
                fecha TEXT
            );

            CREATE TABLE IF NOT EXISTS institucion (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nombre TEXT
            );
            CREATE TABLE IF NOT EXISTS institucion_nadador (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                id_nadador INTEGER,
                id_institucion INTEGER,
                id_competencia INTEGER,
                categoria TEXT,
                configCheck TEXT
            );
            ";

            if($insertNadador!=""){
                $tablas.="INSERT INTO nadador (cedula, nadador, nombres, apellidos, fecha_nacimiento, genero, grupo) VALUES $insertNadador;\n";
            }if($insertPruebas!=""){
                $tablas.="INSERT INTO pruebas (nombre) VALUES $insertPruebas;\n";
            }if($insertMetros!=""){
                $tablas.="INSERT INTO metros (metros) VALUES $insertMetros;\n";
            }if($insertTiempos!=""){
                $tablas.="INSERT INTO tiempos (cedula,fecha,prueba,metros,tiempo) VALUES $insertTiempos;";
            }
            if($insertSerie!=""){
                $tablas.="INSERT INTO serie (id_evento,numero,cedula,nadador,institucion,tiempo,descalificado,puntos,lugar,premiado) VALUES $insertSerie;\n";
            }
            if($insertEvento!=""){
                $tablas.="INSERT INTO evento (id_competencia,numero,prueba,categoria,genero) VALUES $insertEvento;\n";
            }if($insertCompetencia!=""){
                $tablas.="INSERT INTO competencia (nombre,fecha) VALUES $insertCompetencia;\n";
            }if($insertInstitucion!=""){
                $tablas.="INSERT INTO institucion (nombre) VALUES $insertInstitucion;\n";
            }if($insertInstitucionNadador!=""){
                $tablas.="INSERT INTO institucion_nadador (id_nadador,id_institucion,id_competencia,categoria,configCheck) VALUES $insertInstitucionNadador;\n";
            }

            
    
            if ($conexion->exec($tablas)) {
                $mensaje = 'La Base de Datos Android se ha creado correctamente.';
            } else {
                $mensaje = 'No se pudo crear la tabla usuarios.';
            }
    
            $conexion->close();
        }
    
        Flight::json($mensaje);
    }
    // public static function createBD(){

    //     $mensaje = "No hay mensaje";
    //     $archivo = '/Applications/XAMPP/htdocs/natacion/BD/crono_swim.db';
        
    
    //     // Borrar el archivo de la base de datos si existe
    //     if (file_exists($archivo)) {
    //         unlink($archivo);
    //     }
    //     // Crear o abrir la base de datos
    //     $conexion = new SQLite3($archivo);
    //     if (!$conexion) {
    //         $mensaje = 'No se pudo crear o abrir la base de datos. AUTOINCREMENT';
    //     } else {
    //         $insertNadador=Comands::getInsertsInto("nadador",0);
    //         $insertPruebas=Comands::getInsertsInto("pruebas",1);
    //         $insertMetros=Comands::getInsertsInto("metros",1);
    //         $insertTiempos=Comands::getInsertsInto("tiempos",1);
    //         $insertSerie=Comands::getInsertsInto("serie",1);
    //         $insertEvento=Comands::getInsertsInto("evento",1);
    //         $insertCompetencia=Comands::getInsertsInto("competencia",1);
    //         $insertInstitucion=Comands::getInsertsInto("institucion",1);
    //         $insertInstitucionNadador=Comands::getInsertsInto("institucion_nadador",1);


    //         // Crear la tabla usuarios
    //         $tablas = "
        
    //         CREATE TABLE IF NOT EXISTS estudiantes (
    //             id INTEGER PRIMARY KEY AUTOINCREMENT,
    //             cedula INTEGER,
    //             fecha_nacimiento TEXT,
    //             nombres TEXT,
    //             apellidos TEXT,
    //             genero TEXT
    //         );";

    //         $tablas.="INSERT INTO estudiantes (cedula,fecha_nacimiento,nombres,apellidos,genero) 
    //         VALUES (1104661598,'05-07-2000','Edgar Patricio','Torres Condolo','M'),(1104661599,'05-07-2001','Edgar1 Patricio1','Torres1 Condolo1','M');";
    
    //         if ($conexion->exec($tablas)) {
    //             $mensaje = 'La Base de Datos Android se ha creado correctamente.';
    //         } else {
    //             $mensaje = 'No se pudo crear la tabla usuarios.';
    //         }
    
    //         $conexion->close();
    //     }
    
    //     Flight::json($mensaje);
    // }
    public static function getInsertsInto($tabla,$primary){
        $statement = Flight::db()->prepare("SELECT * FROM $tabla");
        $statement->execute();
        $data = $statement->fetchAll();
    
        $insertValues = ""; // Variable para almacenar los valores insertados
    
        foreach ($data as $index => $row) {
            $values = ""; // Reiniciar $values en cada iteración
    
            $values .= "(";
            for ($i = $primary; $i < count($row) / 2; $i++) {
                $values .= "'";
                $values .= $row[$i];
                if ($i + 1 < count($row) / 2) {
                    $values .= "',";
                } else {
                    $values .= "'";
                }
            }
            $values .= ")";
    
            $insertValues .= $values;
    
            if ($index != array_key_last($data)) {
                $insertValues .= ",";
            }
        }
    
        return $insertValues;
    }
    // public static function ejecutar(){
    //     $mensaje = "No hay mensaje";

    //     $statement = Flight::db()->prepare("SELECT serie.cedula,serie.nadador,evento.prueba,serie.tiempo,competencia.nombre FROM serie INNER JOIN
    //     evento ON evento.id = serie.id_evento INNER JOIN 
    //     competencia ON competencia.id=evento.id_competencia");
    //     $statement->execute();
    //     $data = $statement->fetchAll();
    //     foreach ($data as $key => $value) {
    //         $prueba="";
    //         $metros="";
    //         $fecha="";
    //         if("25PR_L"==$value["prueba"]){
    //             $metros="25 Metros";
    //             $prueba="PR_L";
    //             $fecha="03-08-2023";
    //         }
    //         if("25PR_E"==$value["prueba"]){
    //             $metros="25 Metros";
    //             $prueba="PR_E";
    //             $fecha="03-08-2023";
    //         }
    //         if("25Lib"==$value["prueba"]){
    //             $metros="25 Metros";
    //             $prueba="Libre";
    //             $fecha="03-08-2023";
    //         }
    //         if("25Esp"==$value["prueba"]){
    //             $metros="25 Metros";
    //             $prueba="Espalda";
    //             $fecha="03-08-2023";
    //         }
    //         if("25Pech"==$value["prueba"]){
    //             $metros="25 Metros";
    //             $prueba="Pecho";
    //             $fecha="03-08-2023";
    //         }
    //         if("25Mari"==$value["prueba"]){
    //             $metros="25 Metros";
    //             $prueba="Mariposa";
    //             $fecha="03-08-2023";
    //         }
    //         if("50Lib"==$value["prueba"]){
    //             $metros="50 Metros";
    //             $prueba="Libre";
    //             $fecha="04-08-2023";
    //         }
    //         if("50Esp"==$value["prueba"]){
    //             $metros="50 Metros";
    //             $prueba="Espalda";
    //             $fecha="04-08-2023";
    //         }
    //         if("50Pech"==$value["prueba"]){
    //             $metros="50 Metros";
    //             $prueba="Pecho";
    //             $fecha="04-08-2023";
    //         }
    //         if("50Mari"==$value["prueba"]){
    //             $metros="50 Metros";
    //             $prueba="Mariposa";
    //             $fecha="04-08-2023";
    //         }
    //         if("100CI"==$value["prueba"] && "Tercer Campeonato InterEscolar de Natacion 2023"==$value["nombre"]){
    //             $metros="100 Metros";
    //             $prueba="CI";
    //             $fecha="03-08-2023";
    //         }
    //         if("100CI"==$value["prueba"] && "Tercer Campeonato Intercolegial de Natacion 2023"==$value["nombre"]){
    //             $metros="100 Metros";
    //             $prueba="CI";
    //             $fecha="04-08-2023";
    //         }
    //         $array=[
    //             "cedula"=>$value["cedula"],
    //             "fecha"=>$fecha,
    //             "prueba"=>$prueba,
    //             "metros"=>$metros,
    //             "tiempo"=>$value["tiempo"],
    //         ];
    //         $objeto = (object)$array;
    //         SqlService::saveData("tiempos",$objeto);
    //     }
    //     Flight::json($array);
    // }
    public static function ejecutar(){
        $respuesta = "No hay mensaje";

        $statement = Flight::db()->prepare("SELECT * FROM tiempos");
        $statement->execute();
        $data = $statement->fetchAll();
        $lista=[];
        $count=0;
        foreach ($data as $key => $value) {
            if($value["tiempo"]==""){
                
                $condition=[
                    "id"=>$value["id"],
                ];
                $objeto = (object)$condition;

                SqlService::deleteData("tiempos",$objeto);
            }
            $success=[
                "icon"=>"success",
                "title"=>"Éxito",
                "text"=>"Datos procesados correctamente",
            ];
            $respuesta=$success;
            
        }
        Flight::json($respuesta);
    }
}
