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
   
    public static function ejecutar(){
        $respuesta = "No hay mensaje";
        // $letras = 'Metros'; // Las letras que quieres buscar

        // // Preparar la consulta SQL con WHERE y LIKE
        // $statement = Flight::db()->prepare("SELECT * FROM competencia");
        
        // // Concatenar los comodines '%' para buscar cualquier ocurrencia
        // $parametro = "%" . $letras . "%";
        
        // // Asociar el parámetro a la consulta preparada y ejecutarla
        // $statement->execute();
        
        // // Obtener los datos resultantes
        // $data = $statement->fetchAll();
        // $count=0;

        // foreach ($data as $key => $value) {
        //     if (isset($value["fecha"])) {
        //         $fechaSeparada = explode("-", $value["fecha"]);
        
        //         // Verificar que $fechaSeparada tenga al menos 3 elementos antes de acceder a ellos
        //         if (count($fechaSeparada) >= 3) {
        //             $fecha = $fechaSeparada[2] . "-" . $fechaSeparada[1] . "-" . $fechaSeparada[0];

        //             $id=$value["id"];
                    
        //             // Continuar con el procesamiento
        //             if(SqlService::editData("competencia", (object) ["fecha" => $fecha], (object) ["id" => $id])){
        //             $count++;

        //             }
        //         } else {

           

        //         }
        //     } else {
        //         // Manejar el caso donde $value["fecha"] no está definido

        //     }
        // }
        // $respuesta=$count;

        
    
 
        
        
        Flight::json($respuesta);
    }
    
}
