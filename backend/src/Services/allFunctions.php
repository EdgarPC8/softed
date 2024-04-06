<?php
class allFunctions
{
    public static function addElementoToArray(&$array, $key, $value = "")
    {
        $json = json_decode(Flight::request()->getBody());
        $valor = "";
        if (!isset($array[$key])) {
            if (property_exists($json, $key)) {
                $array[$key] = $json->{$key};
            } else {
                $array[$key] = $valor;
            }
        } else {
            $array[$key] = $value;
        }
        for ($i = 1; $i <= 22; $i++) {
            if (property_exists($json, $key . $i)) {
                $valor .= $json->{$key . $i} . " ";
                $array[$key] = $valor;
            }
        }
    }
    public static function removeElementoToArray(&$array, $key)
    {
        if (isset($array[$key])) {
            unset($array[$key]);
        }
    }
    public static function tiempoToNumber($tiempo){
        // Separar la cadena en partes
    $partes = explode(':', $tiempo);
    $horas=$partes[0];
    $min=$partes[1];
    $tiempoMinMil = explode(',', $partes[2]);
    $seg=$tiempoMinMil[0];
    $mils=$tiempoMinMil[1];

    return "$horas$min$seg$mils";
    }


    public static function stringToDate($tiempo){
        if (isset($array[$key])) {
            unset($array[$key]);
        }
    }

    // Función para convertir el tiempo a número
    public static function convertirTiempoATiempoEntero($tiempo) {
        // Separar la cadena en partes
        $partes = explode(':', $tiempo);
        $horas=$partes[0];
        $min=$partes[1];
        $tiempoMinMil = explode(',', $partes[2]);
        $seg=$tiempoMinMil[0];
        $mils=$tiempoMinMil[1];

        $strigNumber=intval("$horas$min$seg$mils");
    
        return strval($strigNumber);
    }
    // Función para convertir fecha de dd-mm-yyyy a yyyy-mm-dd
    public static function convertirFormatoFecha($fecha) {
        $fecha_array = explode('-', $fecha);
        return $fecha_array[2] . '-' . $fecha_array[1] . '-' . $fecha_array[0];
    }
    // Función para convertir fecha de formato yyyy-mm-dd a otro formato con mes en español
    public static function convertirFormatoFechaPersonalizado($fecha) {
        // Crear un objeto DateTime con la fecha proporcionada
        $fecha_datetime = new DateTime($fecha);

        // Formatear la fecha en el formato deseado con el mes en español
        $fecha_personalizada = $fecha_datetime->format('d F Y');

        // Reemplazar el nombre del mes en inglés con el equivalente en español
        $meses_ingles = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        $meses_espanol = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        $fecha_personalizada = str_replace($meses_ingles, $meses_espanol, $fecha_personalizada);

        return $fecha_personalizada;
    }
   
    public static function ordenarYObtenerObjeto($objetos) {
        // Ordenar el array de objetos por fecha
        usort($objetos, function($a, $b) {
            return strtotime(allFunctions::convertirFormatoFecha($a["fecha"])) - strtotime(allFunctions::convertirFormatoFecha($b["fecha"]));
        });

        // Inicializar arrays para las fechas y los tiempos
        $fechasOrdenadas = [];

        // Llenar los arrays ordenados
        $cont=0;
        foreach ($objetos as $objeto) {
            $fechasOrdenadas[$cont]["fecha"] = allFunctions::convertirFormatoFechaPersonalizado(allFunctions::convertirFormatoFecha($objeto["fecha"]));
            $fechasOrdenadas[$cont]["tiempo"] = intval(allFunctions::convertirTiempoATiempoEntero($objeto["tiempo"]));
            $cont++;
        }

        return $fechasOrdenadas;
    }
    public static function obtenerTiempoMasPequeno($objetos) {
        // Inicializar variables para el tiempo más pequeño
        $tiempo_mas_pequeno = PHP_INT_MAX; // Inicializado con un valor muy grande para asegurarse de que cualquier tiempo sea menor
        $fecha_tiempo_mas_pequeno = "";
   

        // Iterar sobre los objetos para encontrar el tiempo más pequeño
        foreach ($objetos as $objeto) {
            $tiempo_entero = intval(allFunctions::convertirTiempoATiempoEntero($objeto["tiempo"]));
            if ($tiempo_entero < $tiempo_mas_pequeno) {
                $tiempo_mas_pequeno = $tiempo_entero;
                $fecha_tiempo_mas_pequeno = allFunctions::convertirFormatoFechaPersonalizado(allFunctions::convertirFormatoFecha($objeto["fecha"]));
            }
        }
        return ["tiempo" => $tiempo_mas_pequeno, "fecha" => $fecha_tiempo_mas_pequeno];
    }
    public static function getTiemposProcesadorBarChart($Tiempos) {
        $ejemplo = [];
        $metros = ["25 Metros", "50 Metros", "75 Metros", "100 Metros",
        "125 Metros","150 Metros","175 Metros","200 Metros",
        "225 Metros","250 Metros","275 Metros","300 Metros"];
        $pruebas = ["Mariposa", "Espalda", "Pecho", "Libre","BR_M","BR_E","BR_P","BR_L","PR_M","PR_E","PR_P","PR_L"];
    
      // Crear un array de todas las combinaciones válidas de metros y pruebas
        $combinacionesValidas = [];
        foreach ($metros as $metro) {
            foreach ($pruebas as $prueba) {
                $combinacionesValidas[] = ['Metros' => $metro, 'Prueba' => $prueba];
            }
        }

        // Iterar sobre todas las combinaciones válidas y marcar si se encuentra en los tiempos
        foreach ($combinacionesValidas as $combinacion) {
            $encontrado = false;
            foreach ($Tiempos as $tiempo) {
                if ($tiempo['Metros'] === $combinacion['Metros'] && $tiempo['Prueba'] === $combinacion['Prueba']) {
                    $ejemplo[] = $tiempo;
                    $encontrado = true;
                    break;
                }
            }
            if (!$encontrado) {
                // Si no se encuentra, agregar un registro con valores nulos
                $ejemplo[] = [
                    "Fecha" => "05-07-2000",
                    "Metros" => $combinacion['Metros'],
                    "Prueba" => $combinacion['Prueba'],
                    "tiempo" => "00:00:00,00",
                ];
            }
        }
        function encontrarPosicion($array, $valor) {
            foreach ($array as $posicion => $elemento) {
                if ($elemento === $valor) {
                    return $posicion;
                }
            }
            // Si el valor no se encuentra en el array, devolvemos -1 o cualquier otro indicador de que no se encontró.
            return -1;
        }
        $valor=[];

        foreach ($ejemplo as $key => $value) {
            $valor[$value["Metros"]][$value["Prueba"]]=intval(allFunctions::convertirTiempoATiempoEntero($value["tiempo"]));
        }
        $ejemplo=[];

        foreach ($valor as $key => $value) {
            foreach ($value as $key2 => $value2) {
                // $ejemplo[$key2][encontrarPosicion($pruebas,$key2)]=$value2;
                $ejemplo[$key][encontrarPosicion($pruebas,$key2)]=$value2;
            }
        }
        $valor=[];
        foreach ($ejemplo as $key => $value) {
            $valor[encontrarPosicion($metros,$key)]["data"]=(array)$value;
            $valor[encontrarPosicion($metros,$key)]["label"]=$key;
            $valor[encontrarPosicion($metros,$key)]["prueba"]=$pruebas[encontrarPosicion($metros,$key)];
        }
        return $valor;

    }
   
    
}