<?php

class Sesiones{

    public static function setSession(){
        $respuesta=false;
        $data = json_decode(Flight::request()->getBody());
        $respuesta=$data;
        if($data->password==12){
            session_start();
            $_SESSION["session"] = [
                "Admin" => 1104661598,
            ];
            // Session::setSession(1104661598);
            $success=[
                "icon"=>"success",
                "title"=>"Éxito",
                "text"=>"Registrado correctamente",
            ];
            $respuesta=$success;

        }else{
            
            $respuesta=null;
        }

        
        
        Flight::json($respuesta);

    }
    public static function getSession(){
        $respuesta=Session::getSession();

        // session_start();
        // if(isset($_SESSION["session"])
        // // &&$_SESSION["session"]->Admin=1104661598
        // ){
        //     $respuesta=true;
        // }
        Flight::json($respuesta);

    }
    public static function closeSession(){
        $respuesta=false;
        session_unset();
        session_destroy();
        // $respuesta=true;
        Flight::json($respuesta);

    }
   
}
