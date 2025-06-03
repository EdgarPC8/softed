<?php


class Notifys
{
    public static function getNotifys($dni, $rolId)
    {
        $stm = Flight::db()->prepare("
            SELECT * FROM notificaciones WHERE rol=$rolId AND tipo_notificacion='General' UNION
            SELECT * FROM notificaciones WHERE rol=$rolId AND destinatario=$dni
        ");
        $stm->execute();
        $data = $stm->fetchAll();
        $map = array_map(function ($key) {
            return [
                "rol" => $key["rol"],
                "destinary" => $key["destinatario"],
                "notifyType" => $key["tipo_notificacion"],
                "message" => $key["mensaje"],
                "count" => $key["cantidad"],
                "date" => $key["fecha_hora"],
                "route" => $key["ruta"]
            ];
        }, $data);

        Flight::json($map);
    }
    
}
