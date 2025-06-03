<?php



class LoggerMiddleware {
    public static function logs($request, $response, $next) {
        $system = $_SERVER['HTTP_USER_AGENT'];
        $httpMethod = $request->getMethod();
        $endPoint = $request->url;
        $methodsToFilter = ["GET", "OPTIONS"];
        $urlFilter = ["/login"];

        $actions = [
            [
                "url" => "/api/matriz/editCareer/:careerId",
                "action" => "Se editó una Carrera",
                "method" => "PUT"
            ],
        ];

        $description = "No definida";

        // Verificar el método HTTP y la URL contra los filtros
        if (!in_array($httpMethod, $methodsToFilter) && !in_array($endPoint, $urlFilter)) {
            // Guardar en la base de datos solo si no se encuentra en la lista de métodos o URLs a filtrar
            SqlService::saveData("logs", (object)[
                "httpMethod" => $httpMethod,
                "action" => "No definica",
                "endPoint" => $endPoint,
                "description" => $description,
                "system" => $system
            ]);
        }

        $next();
    }
}

?>
