<?php

class NivelHotelController{
    public static function getNivel() {
        $data=Nivel::findAll();
        Flight::json($data);
    }
    public static function addNivel()
    {
        try{
            $data = json_decode(Flight::request()->getBody());
            $nuevoRegistro = new Nivel((array)$data);
            $nuevoRegistro->save();
            Flight::json(["message" => "agregadpo con exito"]);

        } catch (PDOException $e) {
            return $e;
        }
    }
    public static function deleteNivel($id)
    {
        $user=Nivel::find($id);
        $user->delete();
        Flight::json(["message" => "Nivel eliminado con éxito"]);

    }

    public static function updateNivel($id)
    {
        $data = json_decode(Flight::request()->getBody());
        $registro = Nivel::find($id); // Buscar el registro
        $registro->update((array)$data); // Pasar los valores a actualizar
        Flight::json(["message" => "Nivel editado con éxito"]);
    }
    public static function getOneNivel($id)
    {
        $user=Nivel::find($id);

        Flight::json($user->attributes);
    }
    
}
