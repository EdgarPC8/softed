<?php

class HotelController{
    public static function getHotel() {
        $data=Hotel::findAll();
        Flight::json($data);
    }
    public static function addHotel()
    {
        try{
            $data = json_decode(Flight::request()->getBody());
            $nuevoRegistro = new Hotel((array)$data);
            $nuevoRegistro->save();
            Flight::json(["message" => "agregadpo con exito"]);

        } catch (PDOException $e) {
            return $e;
        }
    }
    public static function deleteHotel($id)
    {
        $user=Usuario::find($id);
        $user->delete();
        Flight::json(["message" => "Hotel eliminado con éxito"]);

    }

    public static function updateHotel($id)
    {
        $data = json_decode(Flight::request()->getBody());
        $registro = Hotel::find($id); // Buscar el registro
        $registro->update((array)$data); // Pasar los valores a actualizar
        Flight::json(["message" => "Hotel editado con éxito"]);
    }
    public static function getOneHotel($id)
    {
        $user=Hotel::find($id);

        Flight::json($user->attributes);
    }
    
}
