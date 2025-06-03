<?php


class Log
{
    // add,delete,edit,complete
    protected static $request;


    public static function addLog($array)
    {
        try {
            $columns = implode(",", array_keys($array));
            $values = implode("','", array_values($array));
            $statement =  Flight::db()->prepare("INSERT INTO logs ($columns) VALUES ('{$values}')");
            if ($statement->execute()) {
                return ["savedLog" => true];
            };
            // return Flight::db()->lastInsertId();
            // return []
        } catch (PDOException $e) {
            return false;
        }
    }

    public static function getSystemOperativeUser()
    {
        $userAgent = Flight::request()->user_agent;

        $sistemasOperativos = array(
            '/windows nt 10/i'      =>  'Windows 10',
            '/windows nt 6.3/i'     =>  'Windows 8.1',
            '/windows nt 6.2/i'     =>  'Windows 8',
            '/windows nt 6.1/i'     =>  'Windows 7',
            '/windows nt 6.0/i'     =>  'Windows Vista',
            '/windows nt 5.2/i'     =>  'Windows Server 2003/XP x64',
            '/windows nt 5.1/i'     =>  'Windows XP',
            '/windows xp/i'         =>  'Windows XP',
            '/windows nt 5.0/i'     =>  'Windows 2000',
            '/windows me/i'         =>  'Windows ME',
            '/win98/i'              =>  'Windows 98',
            '/win95/i'              =>  'Windows 95',
            '/win16/i'              =>  'Windows 3.11',
            '/macintosh|mac os x/i' =>  'Mac OS X',
            '/mac_powerpc/i'        =>  'Mac OS 9',
            '/linux/i'              =>  'Linux',
            '/ubuntu/i'             =>  'Ubuntu',
            '/iphone/i'             =>  'iPhone',
            '/ipod/i'               =>  'iPod',
            '/ipad/i'               =>  'iPad',
            '/android/i'            =>  'Android',
            '/blackberry/i'         =>  'BlackBerry',
            '/webos/i'              =>  'Mobile'
        );

        foreach ($sistemasOperativos as $regex => $sistemaOperativo) {
            if (preg_match($regex, $userAgent)) {
                return $sistemaOperativo;
            }
        }
    }
    public static function getDateHour()
    {
        date_default_timezone_set('America/Guayaquil');
        $horaActualEcuador = date('Y-m-d H:i:s', time());
        return $horaActualEcuador;
    }
    public static function initLogger($action)
    {

        $requestBody = Flight::request()->getBody();
        self::$request = ($requestBody !== null) ? json_decode($requestBody) : null;



        $message = self::getMessage($action);
        $module = self::getModule($action);
        $time = self::getDateHour();
        $user = self::getUser();
        $logType = self::getLogType($action);
        $operativeSystem = self::getSystemOperativeUser();

        $data = [
            "fecha_hora" => "$time",
            "tipo_log" => "$logType",
            "modulo" => "$module",
            "sistema_operativo" => "$operativeSystem",
            "mensaje" => "$message",
            "usuario" => "$user->names"

        ];

        // return $data;
        return self::addLog($data);
    }


    public static function getLogType($action)
    {
        $url = Flight::request()->url;
        $modules = [
            "ADD" => "Adición",
            "COMPLETE" => "Completado",
            "DELETE" => "Eliminación",
            "EDIT" => "Edición",
            "RESET" => "Reseteo",
            "EXIT" => "Salida",
            "AUTH" => "Autenticación"
        ];

        return $modules["$action"];
    }



    public static function getModule($action)
    {
        $url = Flight::request()->url;
        $modules = [
            "ADD:/addMedicalRecord" => "Ficha Médica",
            "COMPLETE:/addMedicalRecord" => "Ficha Médica",
            "ADD:/users" => "Usuario",
            "EDIT:/users" => "Usuario",
            "DELETE:/users" => "Usuario",
            "EDIT:/users/changePassword" => "Perfil",
            "EDIT:/institution" => "Institución",
            "ADD:/institution" => "Institución",
            "AUTH:/auth" => "Login",
            "EXIT:/auth/logout" => "Login",

        ];


        return $modules["$action:$url"];
    }


    public static function getMessage(string $action)
    {
        $request = self::$request;
        $user = self::getUser();

        if (isset($request->codigo) && isset($request->cedula) && isset($request->admisionista)) {
            $codigo = $request->codigo;
            $cedula = $request->cedula;
            $admisionista = $request->admisionista;
        } else {
            $codigo = "";
            $cedula = "";
            $admisionista = "";
        }

        $sqlNamesAdmisionista = "(SELECT CONCAT(nombres,' ',apellidos,' con cedula ',cedula)AS admisionista  FROM usuario WHERE cedula=$admisionista AND activo=1 UNION 
        SELECT CONCAT(nombres,' ',apellidos,' con cedula ',cedula)AS admisionista FROM enfermero WHERE cedula=$admisionista AND activo=1)";
        $sqlNamesDoctor = "doctor.nombres, ' ', doctor.apellidos, ' con cédula ', doctor.cedula";
        $sqlNamesPaciente = "paciente.nombres, ' ', paciente.apellido_paterno,' ',
        paciente.apellido_materno, ' con cedula ', paciente.cedula";
        $sqlTablas = "FROM  enfermero, doctor,paciente ";
        $sqlMessage = "";
        $sqlWhere = " WHERE doctor.cedula = $codigo AND paciente.cedula=$cedula";
        $url = Flight::request()->url;
        $message = "no hay mensaje";

        switch ("$action:$url") {
            case 'ADD:/addMedicalRecord':
                $sqlMessage = "'El Admisionista ', $sqlNamesAdmisionista , ' añadió al paciente ',$sqlNamesPaciente, ' y se asignó al doctor ', $sqlNamesDoctor, '.'";
                break;

            case 'COMPLETE:/addMedicalRecord':
                $sqlMessage = "'El Doctor ', $sqlNamesDoctor, ' completo la ficha del  paciente ',$sqlNamesPaciente, ' y su adisionista es ', $sqlNamesAdmisionista, '.'";
                break;

            case 'ADD:/users':
                $message = "El usuario $user->names co cedula $user->dni agrego al usuario 
                $request->first_name $request->second_name $request->first_lastname $request->second_lastname con cedula $request->dni";
                break;

            case 'EDIT:/users':
                $message = "El usuario $user->names con cedula $user->dni editó los datos del usuario 
                $request->first_name $request->second_name $request->first_lastname $request->second_lastname con cedula $request->dni";
                break;

            case 'DELETE:/users':

                $sqlMessage = "'El Usuario $user->names con cedula $user->dni elimino al usuario',
                (SELECT CONCAT(nombres,' ',apellidos,' con cedula ',cedula)AS msg  FROM usuario WHERE cedula=$request->dni UNION 
                SELECT CONCAT(nombres,' ',apellidos,' con cedula ',cedula)AS msg FROM enfermero WHERE cedula=$request->dni UNION
               SELECT CONCAT(nombres,' ',apellidos,' con cedula ',cedula)AS msg FROM doctor WHERE cedula=$request->dni),'.'";
                $sqlWhere = "";
                $sqlTablas = "";

            case 'EDIT:/users/changePassword':

                $message = "El usuario $user->names ha cambiado su contraseña";
                // echo "cambiando password";
                break;
            case 'RESET:/users/changePassword':
                $sqlMessage = "'El Usuario $user->names con cedula $user->dni reseteo la contraseña del usuario ',
                (SELECT CONCAT(nombres,' ',apellidos,' con cedula ',cedula)AS msg  FROM usuario WHERE cedula=$request->resetPassword UNION 
                SELECT CONCAT(nombres,' ',apellidos,' con cedula ',cedula)AS msg FROM enfermero WHERE cedula=$request->resetPassword UNION
               SELECT CONCAT(nombres,' ',apellidos,' con cedula ',cedula)AS msg FROM doctor WHERE cedula=$request->resetPassword),'.'";
                $sqlWhere = "";
                $sqlTablas = "";
                break;

            case 'EDIT:/institution':
                // echo "editando institutción";
                $message = "El usuario $user->names ha editado los datos de la institución  con id $request->institutionId";
                break;
            case 'ADD:/institution':
                $message = "El usuario $user->names ha añadido la institución $request->agregar_institucion_sistema";
                break;

            case 'AUTH:/auth':
                // echo "editando institutción";
                $message = "El usuario $user->names se ha logeado en el sistema";
                break;
            case 'EXIT:/auth/logout':
                $message = "El usuario $user->names se ha deslogeado del sistema";
                break;

            default:
                # code...
                break;
        }

        $sqlRespuesta = SqlService::selectDataBD(
            "SELECT CONCAT($sqlMessage) AS mensaje $sqlTablas $sqlWhere"
        );
        return $sqlRespuesta[0]["mensaje"] ?? $message;
        // var_dump()
        // $messageList = [
        //     "ADD:/addMedicalRecord" => [
        //         "{mensaje}" =>  $sqlMessage["mensaje"],
        //     ],
        // ];
        // $message = self::$action["$action:$url"]["message"];
        // $dataToMessage = $messageList["$action:$url"];
        // $logMessage = strtr($message, $dataToMessage);
    }
    public static function getUser()
    {
        $user = (object) Session::getSession()["session"];
        return $user;
    }
}
