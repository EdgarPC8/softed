<?php

class ComandsController{
   
    public static function importJson(){
     // Obtener el cuerpo de la solicitud
     $requestBody = Flight::request()->getBody();
     // Decodificar el JSON recibido
     $data = json_decode($requestBody, true); // 'true' convierte a un array asociativo
 
     if (json_last_error() === JSON_ERROR_NONE) {
         // Definir las rutas de las carpetas
         $backupsDir = './src/Backups/';
         $bdDir = './src/BD/';
 
         // Crear la carpeta Backups si no existe
         if (!file_exists($backupsDir)) {
             mkdir($backupsDir, 0755, true); // 0755 permisos, true para crear directorios padres
         }
 
         // Obtener la fecha y hora actual para el nombre del archivo
         $dateTime = date('Y-m-d_H-i-s'); // Formato: AAAA-MM-DD_HH-MM-SS
         $backupFileName = $backupsDir . "backup_{$dateTime}.json";
         
         // Guardar el JSON en la carpeta Backups
         file_put_contents($backupFileName, json_encode($data, JSON_PRETTY_PRINT));
 
         // Reemplazar el archivo backup.json en la carpeta BD
         $bdFileName = $bdDir . 'backup.json';
         file_put_contents($bdFileName, json_encode($data, JSON_PRETTY_PRINT));
 
         // Para comprobar que recibiste los datos
         error_log(print_r($data, true)); // Guarda en el log del servidor para depuración
 
         // Responder con un mensaje de éxito
         Flight::json(['status' => 'success', 'message' => 'Datos recibidos correctamente.']);
     } else {
         // Si hubo un error al decodificar el JSON
         Flight::json(['status' => 'error', 'message' => 'Error al procesar el JSON.'], 400);
     }
    }
    public static function importFromJson($json_file_path) {
        // Define el orden deseado de las tablas
        $tablaOrder =array(
            Usuario::getTableName(),
            Roles::getTableName(),
            Cuenta::getTableName(),
            Logs::getTableName(),
        );
    
        // Leer el contenido del archivo JSON
        $json_data = file_get_contents($json_file_path);
        
        // Decodificar el JSON a un array asociativo
        $datos_por_tabla = json_decode($json_data, true);
        
        // Iterar sobre cada tabla en el orden especificado
        foreach ($tablaOrder as $tabla) {
            // Verificar si la tabla existe en el array de datos
            if (isset($datos_por_tabla[$tabla])) {
                $datos = $datos_por_tabla[$tabla];
                // Verificar si hay datos para insertar
                if (!empty($datos)) {
                    // Preparar la sentencia de inserción
                    $columns = implode(',', array_keys($datos[0]));
                    $values_placeholder = rtrim(str_repeat('?,', count($datos[0])), ',');
                    $sql = "INSERT INTO $tabla ($columns) VALUES ($values_placeholder)";
                    $statement = Flight::db()->prepare($sql);
                    
                    // Insertar cada registro en la tabla
                    foreach ($datos as $registro) {
                        $statement->execute(array_values($registro));
                    }
                } else {
                    echo "No hay datos para insertar en la tabla $tabla.\n";
                }
            } else {
                echo "La tabla $tabla no existe en el archivo JSON.\n";
            }
        }
        
        echo "Datos importados correctamente.\n";
    }
    
 
    public static function exportToClient() {
        // Recopilar los datos de cada tabla
       
        $datos_por_tabla[Logs::getTableName()] = Logs::findAll();
        $datos_por_tabla[Usuario::getTableName()] = Usuario::findAll();
        $datos_por_tabla[Cuenta::getTableName()] = Cuenta::findAll();
        $datos_por_tabla[Roles::getTableName()] = Roles::findAll();
    
        // Utilizar Flight para devolver los datos en formato JSON
        Flight::json($datos_por_tabla);
    }
    public static function export() {

        $datos_por_tabla[Logs::getTableName()] = Logs::findAll();
        $datos_por_tabla[Usuario::getTableName()] = Usuario::findAll();
        $datos_por_tabla[Cuenta::getTableName()] = Cuenta::findAll();
        $datos_por_tabla[Roles::getTableName()] = Roles::findAll();
        
        // Convertir el array de datos a formato JSON
        $datos_json = json_encode($datos_por_tabla, JSON_PRETTY_PRINT);

        // Configurar cabeceras HTTP para la descarga del archivo
        header('Content-Type: application/json');
        header('Content-Disposition: attachment; filename="dataBase.json"');
        header('Pragma: no-cache');
        header('Expires: 0');

        // Salida de los datos JSON
        echo $datos_json;

        // Detener la ejecución del script después de la descarga
        exit();
        Flight::json("Tablas Exportadas correctamente.");

    }
    
}
