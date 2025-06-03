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
        try{
            $data = json_decode(Flight::request()->getBody());
            $nuevoRegistro = new Usuario((array)$data);
            $nuevoRegistro->save();
        } catch (PDOException $e) {
            return $e;
        }
    }

    public static function getUsers(){Flight::json(Usuario::findAll());}

    public static function getOneUser($id)
    {
        $user=Usuario::find($id);
        Flight::json($user->attributes);
    }

    public static function deleteUser($id)
    {
        $user=Usuario::find($id);
        $user->delete();
        Flight::json(["message" => "Usuario eliminado con éxito"]);

    }

    public static function updateUser($id)
    {
        $data = json_decode(Flight::request()->getBody());
        $registro = Usuario::find($id); // Buscar el registro
        $registro->update((array)$data); // Pasar los valores a actualizar
        Flight::json(["message" => "Usuario editado con éxito"]);
    }

}
