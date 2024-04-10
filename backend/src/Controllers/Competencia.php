<?php

class Competencia{
    

    public static function getEntidadCompetencia(){
        $respuesta=false;
        // $data = json_decode(Flight::request()->getBody());
        $data = (object)[
            "IdCompetencia"=>3,
        ];

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
        $data = (object)[
            "IdCompetencia"=>3,
            "Create"=>false,
        ];

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
        // $data = json_decode(Flight::request()->getBody());
        $data = (object)[
            "IdCompetencia"=>3,
        ];

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
        // $data = json_decode(Flight::request()->getBody());
        $data = (object)[
            "IdCompetencia"=>3,
        ];

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
    public static function updateTimeCompetencia($id)
    {
        $body = json_decode(Flight::request()->getBody());

        if (SqlService::editData("serie", $body, (object) ["id" => $id])) {

            Flight::json(["message" => "Tiempo actualizados"]);
        }
    }

}