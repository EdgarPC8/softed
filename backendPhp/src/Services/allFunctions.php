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
                $combinacionesValidas[] = ['metros' => $metro, 'prueba' => $prueba];
            }
        }

        // Iterar sobre todas las combinaciones válidas y marcar si se encuentra en los tiempos
        foreach ($combinacionesValidas as $combinacion) {
            $encontrado = false;
            foreach ($Tiempos as $tiempo) {
                if ($tiempo['metros'] === $combinacion['metros'] && $tiempo['prueba'] === $combinacion['prueba']) {
                    $ejemplo[] = $tiempo;
                    $encontrado = true;
                    break;
                }
            }
            if (!$encontrado) {
                // Si no se encuentra, agregar un registro con valores nulos
                $ejemplo[] = [
                    "fecha" => "05-07-2000",
                    "metros" => $combinacion['metros'],
                    "prueba" => $combinacion['prueba'],
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
            $valor[$value["metros"]][$value["prueba"]]=intval(allFunctions::convertirTiempoATiempoEntero($value["tiempo"]));
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


    // ------------------------------------------------------------------------------------------------------------------
    // 1.10 1.10 1.10 1.10 1.10 5.50
    public static function getCategoria($stringDate){
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
    public static  function descomponerValor($valor, $limiteSuperior) {
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
    public static function getSeries($array,$carriles){
        $obj=[];
        $sizeArray=count($array);
        $series=allFunctions::descomponerValor($sizeArray,$carriles);
        $serie=0;
        $contadorSerie=0;
        $contador=1;
        foreach ($array as $key => $nad) {
            if($sizeArray<=$carriles){    
                // $obj[$serie]=$array;
                $nad["carril"]=$contador;
                $obj[$serie]["nadadores"][]=$nad;
            }else{
                // return $series;
                if($contadorSerie<$series[$serie]){
                    $nad["carril"]=$contador;
                    $obj[$serie]["nadadores"][]=$nad;
                }else{
                    $serie++;
                    $contadorSerie=0;
                    $contador=1;
                    $nad["carril"]=$contador;
                    $obj[$serie]["nadadores"][]=$nad;
                }
                $contadorSerie++;
            }
            $contador++;
        }
        return $obj;
    }
    public static function getMetrosPrueba($string){
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
    public static function getObjetoMetrosPrueba($string){
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
    public static function getTiempo($nadador){
        $array=SqlService::selectData("tiempos",
        ["tiempos.*"],
        ["cedula"=>$nadador["Cedula"],"metros"=>$nadador["Metros"],"prueba"=>$nadador["Prueba"]],null,"tiempo");
        if(count($array)>0){
            return $array[0]["tiempo"];
        }else{
            return "";
        }
    }
    public static function cmp($a, $b) {
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
    public static function intercalarEntidades($array) {
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
    public static function organizarPorTiempoYVacios($array) {

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
    public static function organizarResultadosTiempos($array) {
        usort($array, function($a, $b) {
            // Si uno de los tiempos es vacío, colócalo al final
            if ($a['tiempo'] === '') {
                return 1;
            } elseif ($b['tiempo'] === '') {
                return -1;
            }
    
            // Si $a está descalificado y $b no lo está, coloca $a después de $b
            if ($a['descalificado'] == 1 && $b['descalificado'] != 1) {
                return 1;
            } elseif ($a['descalificado'] != 1 && $b['descalificado'] == 1) {
                return -1;
            }
    
            // Compara los tiempos como strings en orden ascendente
            return strcmp($a['tiempo'], $b['tiempo']);
        });
    
        return $array;
    }
    
    
    public static  function alternarPosicionesNadadores($competencia) {
        foreach ($competencia as &$evento) {
            foreach ($evento['series'] as &$serie) {
                // Obtén el array de nadadores de la serie
                $nadadores = $serie['nadadores'];
    
                // Reorganiza aleatoriamente las posiciones de los nadadores
                shuffle($nadadores);
    
                // Asigna el nuevo orden de nadadores a la serie
                $serie['nadadores'] = $nadadores;
            }
        }
    
        return $competencia;
    }


    public static function getNadadoresByEvento($nadadores,$eventos){
        $ResultadoEventos = [];
        foreach ($nadadores as $persona) {
            $nombre_completo = $persona["primer_nombre"] . " " . $persona["segundo_nombre"] . " " . $persona["primer_apellido"] . " " . $persona["segundo_apellido"];
            $anio_nacimiento = intval(substr($persona["fecha_nacimiento"], 6)); // Extrae el año de la fecha de nacimiento
            $genero = $persona["genero"];
        
            $eventos_persona = explode(",", $persona["configCheck"]);
            
            foreach ($eventos_persona as $evento_persona) {
                foreach ($eventos as $evento) {
                    if ($evento_persona === $evento["name"] && in_array($genero, $evento["genero"]) && in_array($anio_nacimiento, $evento["categoria"]["valor"])) {
                        // Verificar si ya existe un resultado para este evento y género
                        $encontrado = false;
                        foreach ($ResultadoEventos as &$resultadoEvento) {
                            if ($resultadoEvento["name"] === $evento["name"] && $resultadoEvento["genero"] === $genero) {
                                $resultadoEvento["nadadores"][] = [
                                    "nadador" => $persona["nadador"],
                                    "primer_nombre" => $persona["primer_nombre"],
                                    "segundo_nombre" => $persona["segundo_nombre"],
                                    "primer_apellido" => $persona["primer_apellido"],
                                    "segundo_apellido" => $persona["segundo_apellido"],
                                    "fecha_nacimiento" => $persona["fecha_nacimiento"],
                                    "genero" => $genero,
                                    // "categoria" => $evento["categoria"], // Usar el objeto completo de la categoría
                                    "entidad" => $persona["entidad"],
                                    "cedula" => $persona["cedula"],
                                    "id" => $persona["id"],
                                    "id_competencia" => $persona["id_competencia"],
                                    "id_institucion" => $persona["id_institucion"],
                                    "tiempo" => allFunctions::getTiempo(["Cedula"=>$persona["cedula"],"Metros" => $evento["metros"],
                                    "Prueba" => $evento["prueba"],]),
                                ];
                                $encontrado = true;
                                break;
                            }
                        }
                        // Si no existe, agregar uno nuevo
                        if (!$encontrado) {
                            $resultado = [
                                "name" => $evento["name"],
                                "metros" => $evento["metros"],
                                "prueba" => $evento["prueba"],
                                "genero" => $genero,
                                "categoria" => $evento["categoria"], // Usar el objeto completo de la categoría
                                "nadadores" => [
                                    [
                                        "nadador" => $persona["nadador"],
                                        "primer_nombre" => $persona["primer_nombre"],
                                        "segundo_nombre" => $persona["segundo_nombre"],
                                        "primer_apellido" => $persona["primer_apellido"],
                                        "segundo_apellido" => $persona["segundo_apellido"],
                                        "fecha_nacimiento" => $persona["fecha_nacimiento"],
                                        "genero" => $genero,
                                        "entidad" => $persona["entidad"],
                                        "cedula" => $persona["cedula"],
                                        "id" => $persona["id"],
                                        "id_competencia" => $persona["id_competencia"],
                                        "id_institucion" => $persona["id_institucion"],
                                        "tiempo" => allFunctions::getTiempo(["Cedula"=>$persona["cedula"],"Metros" => $evento["metros"],
                                        "Prueba" => $evento["prueba"],]),
                                    ]
                                ]
                            ];
                            $ResultadoEventos[] = $resultado;
                        }
                    }
                }
            }

        }
        usort($ResultadoEventos, function($a, $b) use ($eventos) {
            // Función de comparación para ordenar por el orden de eventos y luego por género
            $indexA = array_search($a['name'], array_column($eventos, 'name'));
            $indexB = array_search($b['name'], array_column($eventos, 'name'));
        
            if ($indexA != $indexB) {
                return $indexA - $indexB; // Ordena por el orden de eventos
            } else {
                // Si están en el mismo evento, ordena por género (F antes que M)
                if ($a['genero'] != $b['genero']) {
                    return ($a['genero'] == 'F') ? -1 : 1;
                }
                return 0;
            }
        });

        
        
        return $ResultadoEventos;
    }
   
    
    public static function getInfoCompetencia($competencia) {
        $reglas = (object) [
            "puestos" => 3 // Establecer el número de puestos a considerar
        ];
    
        $resultados = [];
        
        foreach ($competencia as $keyEvento => &$evento) {
            $puntos = $reglas->puestos;
            $entidadesConsecutivas = 0; // Variable para contar entidades consecutivas
            $entidadesEvento = []; // Variable para almacenar la próxima entidad a la que se le asignarán los puntos
            $ultimaEntidad = null; // Variable para almacenar la última entidad procesada
    
            $entidadesPuntuadas = []; // Arreglo para almacenar las entidades que ya han sumado puntos

            $contador=0;
            foreach ($evento['nadadores'] as $key => &$nad) {
                if ($contador >= $reglas->puestos) {
                    break; // Si ya se han asignado los puntos para los primeros puestos, salir del bucle
                }
                if ($nad["descalificado"] == 1 || $nad["tiempo"] == "") {
                    continue; // Si el nadador está descalificado, omitir la suma de puntos y pasar al siguiente nadador
                }
            
                // Verificar si la entidad actual ya ha sumado puntos en dos ocasiones
                if (!isset($entidadesPuntuadas[$nad["entidad"]]) || $entidadesPuntuadas[$nad["entidad"]] < 2) {
                    if (!isset($resultados[$nad["entidad"]]["puntosTotal"])) {
                        $resultados[$nad["entidad"]]["puntosTotal"] = 0; // Inicializar puntos totales para la entidad si no existen
                        $resultados[$nad["entidad"]]["puntosEvento"] = []; // Inicializar arreglo de puntos por evento
                    }
                    if (!isset($resultados[$nad["entidad"]]["puntosEvento"][$keyEvento])) {
                        $resultados[$nad["entidad"]]["puntosEvento"][$keyEvento] = [
                            "numeroEvento" => $keyEvento + 1, // El índice del evento más 1 (para que empiece en 1)
                            "puntos" => 0 // Inicializar puntos del evento para la entidad si no existen
                        ];
                    }
                    $resultados[$nad["entidad"]]["puntosTotal"] += $puntos; // Sumar puntos totales a la entidad
                    $resultados[$nad["entidad"]]["puntosEvento"][$keyEvento]["puntos"] += $puntos; // Sumar puntos del evento a la entidad
                    $nad["puntos"]=$puntos;
            
                    $entidadesPuntuadas[$nad["entidad"]] = isset($entidadesPuntuadas[$nad["entidad"]]) ? $entidadesPuntuadas[$nad["entidad"]] + 1 : 1; // Incrementar el contador de apariciones de la entidad
                    $puntos--;
                    $contador++;
                } else {
                    // No asignar puntos a la entidad si ya ha sumado puntos en dos ocasiones
                    // Aquí puedes decidir si quieres hacer algo adicional en este caso
                }
            
                 // Reducir los puntos para el siguiente puesto
            }
            
        }
    
        // return $resultados;
        return ["resultados"=>$resultados,"competencia"=>$competencia];
    }
    
    
    
    
   
    
}