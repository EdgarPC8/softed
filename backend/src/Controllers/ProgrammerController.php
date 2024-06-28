<?php


class ProgrammerController
{

    public static function saveBackUp()
    {
        $directoryToSave = getcwd() . "/src/BD";


        if (isset($_FILES['backup'])) {
            $backupFilename = $_FILES['backup']['name'];
            $backupTemporal = $_FILES['backup']['tmp_name'];
            $backupName = "backup.json";
            $path = "$directoryToSave/$backupName";


            if (file_exists($path) && unlink($path) && move_uploaded_file($backupTemporal, $path)) {
                Flight::json(["message" => "Respaldo guardado con éxito."]);

            } else {
                HTTPResponse::errorRequest(["message" => "Hubo un error al subir el archivo."]);
            }

        } else {
            HTTPResponse::badRequest(["message" => "No se ha enviado ningún respaldo."]);
        }
    }


    public static function addImages()
    {
        $directoryToSave = getcwd() . "/homeimages/";

        $errors = [];
        $uploadedFiles = [];


        if (isset($_FILES["images"])) {
            // var_dump($_FILES);
            $images = $_FILES["images"];
            // var_dump($images);
            foreach ($images["name"] as $key => $image) {
                $filename = uniqid() . "-$image";
                $targetFile = $directoryToSave . $filename;

                if (move_uploaded_file($images["tmp_name"][$key], $targetFile)) {
                    # code...
                    $uploadedFiles[] = $filename;
                } else {
                    $errors[] = "Error al guardar la imagen $filename";
                }
            }

            if (empty($errors)) {
                Flight::json(["message" => "Todos los archivos han sido guardados con éxito", "files" => $uploadedFiles]);
            } else {
                HTTPResponse::errorRequest(["Algunas imágenes no se pudieron guardar", "errors" => $errors, "files" => $uploadedFiles]);
            }
        }
    }


    public static function getListImages()
    {
        $directory = getcwd() . "/homeimages/";
        $files = array_diff(scandir($directory), array('..', '.'));
        $listImages = [];

        
        foreach ($files as $image) {
            $listImages[] = ["name" => $image];
        }

        Flight::json(["images" => $listImages]);
    }


    public static function deleteImage($name)
    {
        $directory = getcwd() . "/homeimages/";
        $image = $directory . $name;
        if (unlink($image)) {
            Flight::json(["message" => "Imagen eliminada con éxito"]);
        }
    }
}
