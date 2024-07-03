<?php

class Info{
    public static function getInfo($cedula) {
        $respuesta = false;
        
        $array = SqlService::selectData(
            "tiempos",
            [],
            ["cedula" => $cedula], 
            null, 
            null
        );
    
        // Inicializa un array vacío para agrupar los resultados por fecha
        $groupedByFecha = [];
    
        // Itera sobre los resultados obtenidos de la base de datos
        foreach ($array as $entry) {
            $fecha = $entry['fecha'];
            $prueba = $entry['prueba'];
            $metros = $entry['metros'];
    
            // Consulta para obtener el tiempo mínimo anterior
            $statement = Flight::db()->prepare(
                "SELECT MIN(tiempo) AS tiempo, fecha FROM tiempos 
                WHERE prueba = :prueba 
                AND metros = :metros 
                AND cedula = :cedula 
                AND fecha < :fecha"
            );
            $statement->execute([
                ':prueba' => $prueba,
                ':metros' => $metros,
                ':cedula' => $cedula,
                ':fecha' => $fecha
            ]);
            $recordTime = $statement->fetch(PDO::FETCH_ASSOC);
    
            // Determina el tipo de tiempo
            $tipoTiempo = '';
            if ($recordTime['tiempo']) {
                if ($entry['tiempo'] < $recordTime['tiempo']) {
                    $tipoTiempo = 'Superado'; // Tiempo actual es mejor que el anterior
                } else {
                    $tipoTiempo = 'No Superado'; // Tiempo actual es igual o peor que el anterior
                }
            } else {
                // Si no hay registro anterior, consideramos 'Nuevo'
                $tipoTiempo = 'Nuevo';
            }
            
            // Prepara el tiempo con información adicional
            $tiempo = [
                'id' => $entry['id'],
                'cedula' => $entry['cedula'],
                'metros' => $entry['metros'],
                'tiempo' => $entry['tiempo'],
                'recordAnterior' => $recordTime['tiempo'] ? $recordTime['tiempo'] : null,
                'recordFechaAnterior' => $recordTime['tiempo'] ? $recordTime['fecha'] : null,
                'tipoTiempo' => $tipoTiempo
            ];
    
            // Si la fecha no existe en el array agrupado, la inicializa
            if (!isset($groupedByFecha[$fecha])) {
                $groupedByFecha[$fecha] = [
                    'fecha' => $fecha,
                    'pruebas' => [],
                    'tiemposSuperados' => 0,
                    'tiemposNoSuperados' => 0,
                    'tiemposNuevos' => 0,
                    'tiemposTotal' => 0
                ];
            }
    
            // Si la prueba no existe dentro de la fecha, la inicializa
            if (!isset($groupedByFecha[$fecha]['pruebas'][$prueba])) {
                $groupedByFecha[$fecha]['pruebas'][$prueba] = [
                    'prueba' => $prueba,
                    'dataPruebas' => [],
                    'tiemposSuperados' => 0,
                    'tiemposNoSuperados' => 0,
                    'tiemposNuevos' => 0,
                    'tiemposTotal' => 0
                ];
            }
    
            // Actualiza los contadores según el tipo de tiempo
            switch ($tipoTiempo) {
                case 'Superado':
                    $groupedByFecha[$fecha]['tiemposSuperados']++;
                    $groupedByFecha[$fecha]['pruebas'][$prueba]['tiemposSuperados']++;
                    break;
                case 'No Superado':
                    $groupedByFecha[$fecha]['tiemposNoSuperados']++;
                    $groupedByFecha[$fecha]['pruebas'][$prueba]['tiemposNoSuperados']++;
                    break;
                case 'Nuevo':
                    $groupedByFecha[$fecha]['tiemposNuevos']++;
                    $groupedByFecha[$fecha]['pruebas'][$prueba]['tiemposNuevos']++;
                    break;
            }
    
            // Incrementa el contador total
            $groupedByFecha[$fecha]['tiemposTotal']++;
            $groupedByFecha[$fecha]['pruebas'][$prueba]['tiemposTotal']++;
    
            // Agrega el tiempo al array correspondiente a la prueba dentro de la fecha
            $groupedByFecha[$fecha]['pruebas'][$prueba]['dataPruebas'][] = $tiempo;
        }
    
        // Convierte el array agrupado en una lista de objetos
        $info = [];
        foreach ($groupedByFecha as $fecha => $data) {
            $fechaData = [
                'fecha' => $data['fecha'],
                'pruebas' => array_values($data['pruebas']),
                'tiemposSuperados' => $data['tiemposSuperados'],
                'tiemposNoSuperados' => $data['tiemposNoSuperados'],
                'tiemposNuevos' => $data['tiemposNuevos'],
                'tiemposTotal' => $data['tiemposTotal']
            ];
            $info[] = $fechaData;
        }
    
        // Ordena las fechas de la más reciente a la más antigua
        usort($info, function ($a, $b) {
            return strtotime($b['fecha']) - strtotime($a['fecha']);
        });
    
        // Prepara la respuesta
        $respuesta = ["Info" => $info];
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
