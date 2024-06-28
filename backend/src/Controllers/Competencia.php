<?php

class Competencia{
    

    public static function getEntidadCompetencia(){

         //Pruebas: 25 Metros Espalda, Un acronimo.
        //Categoria:2012-2013, 2012,2013
        // [
        //     {name:"PR_L",metros:"25 Metros",prueba:"PR_L",},
        //     {name:"PR_E",metros:"25 Metros",prueba:"PR_E",},
        //     {name:"Libre25",metros:"25 Metros",prueba:"Libre",},
        //     {name:"Espalda25",metros:"25 Metros",prueba:"Espalda",},
        //     {name:"Pecho25",metros:"25 Metros",prueba:"Pecho",},
        //     {name:"Mariposa25",metros:"25 Metros",prueba:"Mariposa",},
        //     {name:"Libre50",metros:"50 Metros",prueba:"Libre",},
        //     {name:"Espalda50",metros:"50 Metros",prueba:"Espalda",},
        //     {name:"Pecho50",metros:"50 Metros",prueba:"Pecho",},
        //     {name:"Mariposa50",metros:"50 Metros",prueba:"Mariposa",},
        //     {name:"CI100",metros:"100 Metros",prueba:"CI",},
        //   ]

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
                    "ArrayChecks"=>explode(",", $nad["configCheck"]),
                    
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
    public static function administrarCompetencia(){
        $respuesta=false;
        $data = (object)[
            "IdCompetencia"=>3,
            "Create"=>false,
        ];


        $Competencia=[];
        $array=SqlService::selectData("institucion_nadador 
        INNER JOIN nadador ON nadador.cedula=institucion_nadador.id_nadador 
        INNER JOIN competencia ON competencia.id=institucion_nadador.id_competencia 
        INNER JOIN institucion ON institucion.id=institucion_nadador.id_institucion
        ",
        ["institucion.nombre AS entidad","nadador.cedula","nadador.genero","nadador.fecha_nacimiento",
        "nadador.primer_nombre",
        "nadador.segundo_nombre",
        "nadador.primer_apellido",
        "nadador.segundo_apellido"
        ,"Concat(nadador.nombres,' ',nadador.apellidos) AS nadador","institucion_nadador.*"],
        ["id_competencia"=>$data->IdCompetencia],null,"CAST(SUBSTRING_INDEX(institucion_nadador.categoria, '-', 1) AS SIGNED) DESC");
        $contador=1;
        $arrayEventosGenerales=null;
        $eventos = [
            [
                "name" => "Espalda25",
                "metros" => "25 Metros",
                "prueba" => "PR_E",
                "genero" => ["F", "M"],
                "categoria" => [
                    "name" => "2016-2017",
                    "valor" => [2012, 2013]
                ]
            ],
            [
                "name" => "PR_L",
                "metros" => "25 Metros",
                "prueba" => "PR_L",
                "genero" => ["F", "M"],
                "categoria" => [
                    "name" => "2016-2017",
                    "valor" => [2016, 2017]
                ]
            ],
        
         
        ];
        
  
        $personas = [
            ["primer_nombre"=>"Edgar","segundo_nombre"=>"Patricio","primer_apellido"=>"Torres","segundo_apellido"=>"Condolo","fecha_nacimiento" => "01-01-2016",
            "genero" => "M","configCheck" => "PR_E","entidad"=>"Los Tiburones","cedula"=>1104661598,"id"=>1,"id_competencia"=>3,"id_institucion"=>5,"nadador"=>"Edgar Torres"],
            ["primer_nombre"=>"Carlos","segundo_nombre"=>"Ivan","primer_apellido"=>"Cueva","segundo_apellido"=>"sarango","fecha_nacimiento" => "01-01-2016",
            "genero" => "M","configCheck" => "PR_E","entidad"=>"Titanes","cedula"=>1104661599,"id"=>2,"id_competencia"=>3,"id_institucion"=>4,"nadador"=>"Carlos Cueva"],
            ["primer_nombre" => "Ana", "segundo_nombre" => "Luisa", "primer_apellido" => "García", "segundo_apellido" => "Pérez", "fecha_nacimiento" => "01-01-2016",
             "genero" => "F", "configCheck" => "PR_E", "entidad" => "Delfines", "cedula" => 2104661591, "id" => 3, "id_competencia" => 3, "id_institucion" => 6, "nadador" => "Ana García"],
            ["primer_nombre" => "María", "segundo_nombre" => "Elena", "primer_apellido" => "Martínez", "segundo_apellido" => "Gómez", "fecha_nacimiento" => "01-01-2016",
             "genero" => "F", "configCheck" => "PR_E", "entidad" => "Tiburones", "cedula" => 2104661592, "id" => 4, "id_competencia" => 3, "id_institucion" => 7, "nadador" => "María Martínez"],
            ["primer_nombre" => "Laura", "segundo_nombre" => "Isabel", "primer_apellido" => "Fernández", "segundo_apellido" => "López", "fecha_nacimiento" => "01-01-2016",
             "genero" => "M", "configCheck" => "PR_L", "entidad" => "Delfines", "cedula" => 2104661593, "id" => 5, "id_competencia" => 3, "id_institucion" => 8, "nadador" => "Laura Fernández"],
            ["primer_nombre" => "Sofía", "segundo_nombre" => "Valentina", "primer_apellido" => "Sánchez", "segundo_apellido" => "Díaz", "fecha_nacimiento" => "01-01-2016",
             "genero" => "F", "configCheck" => "PR_L", "entidad" => "Tiburones", "cedula" => 2104661594, "id" => 6, "id_competencia" => 3, "id_institucion" => 9, "nadador" => "Sofía Sánchez"],
            ["primer_nombre" => "Lucía", "segundo_nombre" => "Camila", "primer_apellido" => "Rodríguez", "segundo_apellido" => "Martínez", "fecha_nacimiento" => "01-01-2016",
             "genero" => "F", "configCheck" => "PR_L", "entidad" => "Delfines", "cedula" => 2104661595, "id" => 7, "id_competencia" => 3, "id_institucion" => 10, "nadador" => "Lucía Rodríguez"],
        ];
        
        $eventosNadadores = allFunctions::getNadadoresByEvento($array, $eventos);



        $contador=1;
        foreach ($eventosNadadores as &$evento) {
            $evento["numero"]=$contador;
            $contador++;
            $evento["nadadores"] = allFunctions::organizarPorTiempoYVacios($evento["nadadores"]);
            $entidadesEvento = []; // Inicializar arreglo de entidades
        
            // Recorrer cada nadador y agregar sus entidades al arreglo
            foreach ($evento["nadadores"] as $nadador) {
                $entidadesEvento[] = $nadador["entidad"];
            }
        
            // Eliminar duplicados manteniendo el orden original
            $entidadesEvento = array_values(array_unique($entidadesEvento));
        
            // Asignar el arreglo de entidades al evento
            $evento["entidades"] = $entidadesEvento;
        
            // Obtener las series
            $evento["series"] = allFunctions::getSeries($evento["nadadores"], 5);
        }
        
        
        
        
        
        // $respuesta=[
        //     "res"=>allFunctions::alternarPosicionesNadadores($eventosNadadores),
        //     "datos"=>$array,
        // ];
        // $respuesta=allFunctions::alternarPosicionesNadadores($eventosNadadores);

        $respuesta=["IdCompetencia"=>$data->IdCompetencia,"Competencia"=>allFunctions::alternarPosicionesNadadores($eventosNadadores)];

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
        INNER JOIN nadador ON nadador.cedula=serie.cedula
        ",
        ["evento.*","evento.numero AS numeroEvento","serie.numero AS numeroSerie",
        "serie.cedula","serie.carril","serie.tiempo","serie.nadador","institucion.nombre AS entidad",
        "serie.id AS idTiempo","serie.id_evento","serie.descalificado","serie.premiado","serie.lugar","nadador.*"],
        ["id_competencia"=>$data->IdCompetencia],null,null);
    
        $contador=1;
        foreach ($array as $clave => $valor) {
            $nadador = [
                "cedula" => $valor["cedula"],
                "tiempo" => $valor["tiempo"] ? $valor['tiempo'] : "",
                "entidad" => $valor["entidad"],
                "nadador" => $valor["nadador"],
                "carril" => $valor["carril"],
                "id" => $valor["idTiempo"],
                "descalificado" => $valor["descalificado"],
                "premiado" => $valor["premiado"],
                "lugar" => $valor["lugar"],
                "primer_nombre" => $valor["primer_nombre"],
                "segundo_nombre" => $valor["segundo_nombre"],
                "primer_apellido" => $valor["primer_apellido"],
                "segundo_apellido" => $valor["segundo_apellido"],
            ];
        
            // Indexar por número de evento y número de serie
            $Competencia[$valor["numeroEvento"]-1]["series"][$valor["numeroSerie"]-1]["nadadores"][] = $nadador;
            $Competencia[$valor["numeroEvento"]-1]["nadadores"][] = $nadador;
            $Competencia[$valor["numeroEvento"]-1]["categoria"] = ["name" => $valor["categoria"]];
            $Competencia[$valor["numeroEvento"]-1]["genero"] = $valor["genero"];
            $Competencia[$valor["numeroEvento"]-1]["numero"] = $valor["numero"];
            $Competencia[$valor["numeroEvento"]-1]["name"] = $valor["name"];
            $Competencia[$valor["numeroEvento"]-1]["prueba"] = $valor["prueba"]?$valor["prueba"]:'';
            $Competencia[$valor["numeroEvento"]-1]["metros"] = $valor["metros"]?$valor["metros"]:'';
            $Competencia[$valor["numeroEvento"]-1]["idEvento"] = $valor["id_evento"]?$valor["id_evento"]:'';
        }

        foreach ($Competencia as &$evento) {
            $entidadesEvento = []; // Inicializar arreglo de entidades
            $descEvento = []; // Inicializar arreglo de entidades
            $timeEvento = []; // Inicializar arreglo de entidades
        
            // Recorrer cada nadador y agregar sus entidades al arreglo
            foreach ($evento["nadadores"] as $nadador) {
                $entidadesEvento[] = $nadador["entidad"];
                if($nadador["descalificado"]==1){
                    $descEvento[] = $nadador["descalificado"];
                }
                if($nadador["tiempo"]!=""){
                    $timeEvento[] = $nadador["tiempo"];
                }
            }
            // Eliminar duplicados manteniendo el orden original
            $entidadesEvento = array_values(array_unique($entidadesEvento));
            // $descEvento = array_values(array_unique($descEvento));
        
            // Asignar el arreglo de entidades al evento
            $evento["entidades"] = $entidadesEvento;
            $evento["descalificados"] = $descEvento;
            $evento["tiempos"] = $timeEvento;
        }


        $respuesta=["IdCompetencia"=>$data->IdCompetencia,"Competencia"=>$Competencia,"Creada"=>true];
        Flight::json($respuesta);
    }
    public static function createCompetencia(){
        $respuesta=false;
        $data = json_decode(Flight::request()->getBody());
        $Competencia=$data->Competencia;


        $contador=1;
        foreach ($Competencia as $clave => $valor) {
        $idEvento=SqlService::saveData("evento",(object)
        [
            "id_competencia"=>$data->IdCompetencia,
            "numero"=>$contador,
            "name"=>$valor->name,
            "metros"=>$valor->metros,
            "prueba"=>$valor->prueba,
            "categoria"=>$valor->categoria->name,
            "genero"=>$valor->genero
        ]);
            $contadorSerie=1;
            foreach ($valor->series as $keySerie => $valueSerie) {
                foreach ($valueSerie->nadadores as $keyNadador => $valueNad) {
                    SqlService::saveData("serie",(object)
                    [
                        "id_evento"=>$idEvento,
                        "numero"=>$contadorSerie,
                        "carril"=>$valueNad->carril,
                        "cedula"=>$valueNad->cedula,
                        "nadador"=>$valueNad->nadador,
                        "id_institucion"=>$valueNad->id_institucion
                    ]);
                }
                $contadorSerie++;
            }
            $contador++;
        } 
        $respuesta=$Competencia;

        Flight::json($respuesta);



    }
    public static function getResultados(){
        $respuesta = false;
        $data = (object)[
            "IdCompetencia" => 3,
        ];
    
        $Competencia = [];
    
        $array = SqlService::selectData("serie 
        INNER JOIN evento ON evento.id = serie.id_evento 
        INNER JOIN competencia ON competencia.id=evento.id_competencia
        INNER JOIN institucion ON institucion.id=serie.id_institucion
        ",
        ["evento.*","evento.numero AS numeroEvento","serie.numero AS numeroSerie","serie.cedula","serie.carril","serie.tiempo","serie.nadador","institucion.nombre AS entidad","serie.id AS idTiempo","serie.descalificado","serie.premiado","serie.lugar"],
        ["id_competencia" => $data->IdCompetencia], null, null);
    
        foreach ($array as $clave => $valor) {
            $nadador = [
                "cedula" => $valor["cedula"],
                "tiempo" => $valor["tiempo"] ? $valor['tiempo'] : "",
                "entidad" => $valor["entidad"],
                "nadador" => $valor["nadador"],
                "carril" => $valor["carril"],
                "id" => $valor["idTiempo"],
                "descalificado" => $valor["descalificado"],
                "premiado" => $valor["premiado"],
                "lugar" => $valor["lugar"],
            ];
        
            $Competencia[$valor["numeroEvento"]-1]["series"][$valor["numeroSerie"]-1]["nadadores"][] = $nadador;
            $Competencia[$valor["numeroEvento"]-1]["nadadores"][] = $nadador;
            $Competencia[$valor["numeroEvento"]-1]["categoria"] = ["name" => $valor["categoria"]];
            $Competencia[$valor["numeroEvento"]-1]["genero"] = $valor["genero"];
            $Competencia[$valor["numeroEvento"]-1]["numero"] = $valor["numero"];
            $Competencia[$valor["numeroEvento"]-1]["name"] = $valor["name"];
            $Competencia[$valor["numeroEvento"]-1]["prueba"] = $valor["prueba"];
            $Competencia[$valor["numeroEvento"]-1]["metros"] = $valor["metros"];
        }
    
        foreach ($Competencia as &$evento) {
            $entidadesEvento = [];
            $descEvento = [];
            $timeEvento = [];
            $evento["nadadores"] = allFunctions::organizarResultadosTiempos($evento["nadadores"]);
        
            // Asignar puestos y manejar empates
            $puesto = 1;
            $ultimoTiempo = null;
            $contadorEmpates = 0;
    
            foreach ($evento["nadadores"] as &$nadador) {
                if ($nadador["tiempo"] != "") {
                    if ($ultimoTiempo !== null && $nadador["tiempo"] == $ultimoTiempo) {
                        $contadorEmpates++;
                    } else {
                        $puesto += $contadorEmpates;
                        $contadorEmpates = 1;
                    }
                    $nadador["puesto"] = $puesto;
                    $ultimoTiempo = $nadador["tiempo"];
                } else {
                    $nadador["puesto"] = "";
                }
    
                $entidadesEvento[] = $nadador["entidad"];
                if ($nadador["descalificado"] == 1) {
                    $descEvento[] = $nadador["descalificado"];
                }
                if ($nadador["tiempo"] != "") {
                    $timeEvento[] = $nadador["tiempo"];
                }
            }
    
            $entidadesEvento = array_values(array_unique($entidadesEvento));
        
            $evento["entidades"] = $entidadesEvento;
            $evento["descalificados"] = $descEvento;
            $evento["tiempos"] = $timeEvento;
        }
    
        $info = allFunctions::getInfoCompetencia($Competencia);
    
        $respuesta = ["IdCompetencia" => $data->IdCompetencia, "Competencia" => $info["competencia"], "Info" => $info["resultados"]];
        Flight::json($respuesta);
    }
    
    public static function addCompetencia(){
        $data = json_decode(Flight::request()->getBody());

        // if (SqlService::saveData("competencia",$data)) {
        //     # code...
        //     Flight::json(["message" => "Competencia agregada"]);
        // }
   
        $eventos=[];
        foreach ($data->eventos as $key => $value) {
            # code...
            SqlService::saveData("competencia_evento",(object)[
            "id_competencia"=>4,
            "numero"=>$value->numeroEvento,
            "name"=>$value->name,
            "metros"=>$value->metros,
            "prueba"=>$value->prueba,
            "genero"=>$value->genero,
            "categoriaName"=>$value->categoria,
            "categoriaValues"=>$value->anio
            ]);
            // $evento=[];
            // $evento["name"]=$value->name;
            // $evento["metros"]=$value->metros;
            // $evento["prueba"]=$value->prueba;
            // $evento["genero"]=$value->genero;
            // $evento["categoria"]=[
            //     "name"=>$value->categoria,
            //     "valor"=>$value->anio,
            // ];
            // $eventos[]=$evento;
        }
        Flight::json(["message" => "Competencia agregada","eventos"=>$eventos]);
    }
    public static function getCompetenciasData(){
        // $data = json_decode(Flight::request()->getBody());
        $array=SqlService::selectData("competencia");
        Flight::json(["message" => "Competencia agregada","data"=>$array]);
    }
    public static function updateTimeCompetencia($id)
    {
        $body = json_decode(Flight::request()->getBody());

        if (SqlService::editData("serie", $body, (object) ["id" => $id])) {

            Flight::json(["message" => "Tiempo actualizados"]);
        }
    }
    
}