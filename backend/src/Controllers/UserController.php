<?php


class UserController
{

    public static function updatePhoto($dni)
    {
        $directoryToSave = getcwd() . "/photos/";




        // Verifica si se ha enviado un archivo
        if (isset($_FILES['photo'])) {
            $photoName = $_FILES['photo']['name'];
            $photoTemporal = $_FILES['photo']['tmp_name'];
            $ramdomPhotoName = uniqid() . '_' . $photoName;


            $photo = SqlService::selectData(Usuario::$tableName, ["foto"], ["cedula" => $dni])[0]["foto"];

            // var_dump(empty($photo));
            if (empty($photo)) {

                if (move_uploaded_file($photoTemporal, $directoryToSave . $ramdomPhotoName)) {
                    if (SqlService::editData(Usuario::$tableName, (object) ["foto" => $ramdomPhotoName], (object) ["cedula" => $dni])) {
                        Flight::json(["message" => "Foto guardada con éxito"]);
                    }

                }

            } else {

                unlink("$directoryToSave$photo");
                if (move_uploaded_file($photoTemporal, $directoryToSave . $ramdomPhotoName)) {
                    if (SqlService::editData(Usuario::$tableName, (object) ["foto" => $ramdomPhotoName], (object) ["cedula" => $dni])) {
                        Flight::json(["message" => "Foto guardada con éxito"]);
                    }

                }

            }



        } else {
            HTTPResponse::badRequest(["message" => "No se ha enviado ninguna foto."]);
        }





    }



    public static function addPhoto()
    {


        $directoryToSave = getcwd() . "/photos/";

        // var_dump($target_file);

        // $uploadOk = 1;

        // // Verifica si el archivo es una imagen real o una imagen falsa
        // if (isset($_POST["submit"])) {
        //     getimagesize($_FILES["image"]["tmp_name"])
        //         ? $uploadOk = 1
        //         : $uploadOk = 0;

        // }


        // Verifica si se ha enviado un archivo
        if (isset($_FILES['photo'])) {
            $photoName = $_FILES['photo']['name'];
            $photoTemporal = $_FILES['photo']['tmp_name'];
            $ramdomPhotoName = uniqid() . '_' . $photoName;

            // Mueve el archivo al directorio destino
            if (move_uploaded_file($photoTemporal, $directoryToSave . $ramdomPhotoName)) {

                Flight::json(["message" => "Foto subido correctamente."]);

            } else {
                HTTPResponse::errorRequest(["message" => "Hubo un error al subir el archivo."]);
            }
        } else {
            HTTPResponse::badRequest(["message" => "No se ha enviado ninguna foto."]);
        }


        // if ($uploadOk == 0) {
        //     echo "Lo siento, tu archivo no pudo ser subido.";
        // } else {
        //     if (move_uploaded_file($_FILES["image"]["tmp_name"], $target_file)) {
        //         echo "El archivo " . basename($_FILES["image"]["name"]) . " ha sido subido.";
        //     } else {
        //         echo "Lo siento, hubo un error al subir tu archivo.";
        //     }
        // }

    }


    public static function addUser()
    {
        $data = json_decode(Flight::request()->getBody());

        
        if (SqlService::saveData(Usuario::$tableName, $data)) {
            Flight::json(["message" => "Usuario guardado con éxito"]);
        }


    }

    public static function getUsers()
    {
        // Flight::json();
        $data = array_map(function ($row) {

            return [
                "cedula" => $row["cedula"],
                "nombres" => "$row[primer_nombre] $row[segundo_nombre]",
                "apellidos" => "$row[primer_apellido] $row[segundo_apellido]",
                "genero" => $row["genero"],
                "fecha_nacimiento" => $row["fecha_nacimiento"]
            ];

        }, SqlService::selectData(Usuario::$tableName));

        Flight::json($data);
    }

    public static function getOneUser($dni)
    {

        $data = array_map(
            function ($row) {

                return [
                    "cedula" => $row["cedula"],
                    "primer_nombre" => $row["primer_nombre"],
                    "segundo_nombre" => $row["segundo_nombre"],
                    "primer_apellido" => $row["primer_apellido"],
                    "segundo_apellido" => $row["segundo_apellido"],
                    "genero" => $row["genero"],
                    "fecha_nacimiento" => $row["fecha_nacimiento"],
                    "foto" => $row["foto"]
                ];

            },
            SqlService::selectData(
                Usuario::$tableName,
                [],
                ["cedula" => $dni]
            )
        );


        Flight::json($data);

    }

    public static function deleteUser($dni)
    {
        if (SqlService::deleteData(Usuario::$tableName, (object) ["cedula" => $dni])) {
            Flight::json(["message" => "Usuario eliminado con éxito"]);
        }

    }

    public static function updateUser($dni)
    {



        $data = json_decode(Flight::request()->getBody());

        if (SqlService::editData(Usuario::$tableName, $data, (object) ["cedula" => $dni])) {
            Flight::json(["message" => "Usuario editado con éxito"]);
        }


    }

}
