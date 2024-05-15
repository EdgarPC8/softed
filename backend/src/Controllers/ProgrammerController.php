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

}
