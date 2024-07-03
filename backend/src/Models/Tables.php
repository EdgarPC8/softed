<?php 
class Tables {
    const TABLA_SERIE = "serie";
    const TABLA_EVENTO = "evento";
    const TABLA_COMPETENCIA = "competencia";
    const TABLA_INSTITUCION = "institucion";
    const TABLA_INSTITUCION_NADADOR = "institucion_nadador";
    const TABLA_COMPTENCIA_EVENTO = "competencia_evento";
    const TABLA_LOGS = "logs";
    
    public static function create() {
        $tableDe=Roles::$tableName;
        $sentenciaCreate="CREATE TABLE IF NOT EXISTS";
        $espacio=" ";
        $primaryKeyAutoIncrement="PRIMARY KEY AUTO_INCREMENT";
        $primaryKey="PRIMARY KEY";
        $coma=",";
        $typeText="TEXT";
        $typeInteger="INTEGER";
        $typeBigInteger="BIGINT";
        $typeDate="DATE";

        // $ForeignKey="FOREIGN KEY";

        function ForeignKey($fKey,$tableName,$referencia){
            return "FOREIGN KEY ($fKey) REFERENCES $tableName ($referencia)";
        }

        // Sentencias SQL para crear las tablas
        $sentencias_sql = array(
            $sentenciaCreate.$espacio.Usuario::$tableName.
            "(".
                Usuario::$id.$espacio.$typeInteger.$espacio.$primaryKeyAutoIncrement.$coma.
                Usuario::$cedula.$espacio.$typeText.$coma.
                Usuario::$primer_nombre.$espacio.$typeText.$coma.
                Usuario::$segundo_nombre.$espacio.$typeText.$coma.
                Usuario::$primer_apellido.$espacio.$typeText.$coma.
                Usuario::$segundo_apellido.$espacio.$typeText.$coma.
                Usuario::$fecha_nacimiento.$espacio.$typeDate.$coma.
                Usuario::$genero.$espacio.$typeText.
            ")"
            ,
            $sentenciaCreate.$espacio.Roles::$tableName.
            "(".
                Roles::$id.$espacio.$typeInteger.$espacio.$primaryKeyAutoIncrement.$coma.
                Roles::$name.$espacio.$typeText.
            ")"
            ,
            $sentenciaCreate.$espacio.Cuenta::$tableName.
            "(".
                Cuenta::$id.$espacio.$typeInteger.$espacio.$primaryKeyAutoIncrement.$coma.
                Cuenta::$username.$espacio.$typeText.$coma.
                Cuenta::$password.$espacio.$typeText.$coma.
                Cuenta::$idUsuario.$espacio.$typeInteger.$coma.
                Cuenta::$rol.$espacio.$typeInteger.$coma.
                ForeignKey(Cuenta::$rol,Roles::$tableName,Roles::$id).$coma.
                ForeignKey(Cuenta::$idUsuario,Usuario::$tableName,Usuario::$id).
            ")"
            ,
            $sentenciaCreate.$espacio.Nadador::$tableName.
            "(".
                Nadador::$cedula.$espacio.$typeBigInteger.$espacio.$primaryKey.$coma.
                Nadador::$nadador.$espacio.$typeText.$coma.
                Nadador::$primer_nombre.$espacio.$typeText.$coma.
                Nadador::$segundo_nombre.$espacio.$typeText.$coma.
                Nadador::$primer_apellido.$espacio.$typeText.$coma.
                Nadador::$segundo_apellido.$espacio.$typeText.$coma.
                Nadador::$nombres.$espacio.$typeText.$coma.
                Nadador::$apellidos.$espacio.$typeText.$coma.
                Nadador::$fecha_nacimiento.$espacio.$typeDate.$coma.
                Nadador::$genero.$espacio.$typeText.$coma.
                Nadador::$grupo.$espacio.$typeInteger.
            ")"
            ,
            $sentenciaCreate.$espacio.Tiempos::$tableName.
            "(".
                Tiempos::$id.$espacio.$typeInteger.$espacio.$primaryKeyAutoIncrement.$coma.
                Tiempos::$cedula.$espacio.$typeBigInteger.$coma.
                Tiempos::$fecha.$espacio.$typeDate.$coma.
                Tiempos::$prueba.$espacio.$typeText.$coma.
                Tiempos::$metros.$espacio.$typeText.$coma.
                Tiempos::$tiempo.$espacio.$typeText.
            ")"
            ,
            $sentenciaCreate.$espacio.Metros::$tableName.
            "(".
                Metros::$id.$espacio.$typeInteger.$espacio.$primaryKeyAutoIncrement.$coma.
                Metros::$metros.$espacio.$typeText.
            ")"
            ,
            $sentenciaCreate.$espacio.Pruebas::$tableName.
            "(".
                Pruebas::$id.$espacio.$typeInteger.$espacio.$primaryKeyAutoIncrement.$coma.
                Pruebas::$nombre.$espacio.$typeText.
            ")"
            ,
          
            "CREATE TABLE IF NOT EXISTS " . self::TABLA_SERIE . " (
                id INTEGER PRIMARY KEY AUTO_INCREMENT, 
                id_evento INTEGER, 
                numero INTEGER, 
                carril INTEGER, 
                cedula INTEGER, 
                nadador TEXT, 
                id_institucion INTEGER, 
                tiempo TEXT, 
                descalificado INTEGER DEFAULT 0, 
                puntos INTEGER, 
                lugar INTEGER, 
                premiado INTEGER DEFAULT 1
            )",

            "CREATE TABLE IF NOT EXISTS " . self::TABLA_EVENTO . " (
                id INTEGER PRIMARY KEY AUTO_INCREMENT, 
                id_competencia INTEGER, 
                numero INTEGER, 
                name TEXT, 
                prueba TEXT, 
                metros TEXT, 
                categoria TEXT, 
                genero TEXT
            )",
            
            "CREATE TABLE IF NOT EXISTS " . self::TABLA_COMPETENCIA . " (
                id INTEGER PRIMARY KEY AUTO_INCREMENT, 
                nombre TEXT, 
                fecha DATE
            )",
            "CREATE TABLE IF NOT EXISTS " . self::TABLA_INSTITUCION . " (
                id INTEGER PRIMARY KEY AUTO_INCREMENT, 
                nombre TEXT
            )",
            "CREATE TABLE IF NOT EXISTS " . self::TABLA_INSTITUCION_NADADOR . " (
                id INTEGER PRIMARY KEY AUTO_INCREMENT, 
                id_nadador INTEGER, 
                id_institucion INTEGER, 
                id_competencia INTEGER, 
                categoria TEXT, 
                configCheck TEXT
            )",
            "CREATE TABLE IF NOT EXISTS " . self::TABLA_COMPTENCIA_EVENTO . " (
                id INTEGER PRIMARY KEY AUTO_INCREMENT, 
                id_competencia INTEGER, 
                numero INTEGER, 
                name TEXT, 
                metros TEXT, 
                prueba TEXT, 
                categoriaName TEXT,
                categoriaValues TEXT,
                genero TEXT
            )",
            "CREATE TABLE IF NOT EXISTS " . self::TABLA_LOGS . " (
                id INTEGER PRIMARY KEY AUTO_INCREMENT, 
                httpMethod TEXT, 
                action TEXT, 
                endPoint TEXT, 
                description TEXT, 
                system TEXT, 
                date DATE DEFAULT CURRENT_TIMESTAMP
            )"
        );
        // Ejecutar cada sentencia SQL
        foreach ($sentencias_sql as $sentencia) {
            $statement = Flight::db()->prepare($sentencia);
            $statement->execute();
        }

        Flight::json("Tablas creadas correctamente.");

    }
    public static function delete() {
        // Sentencias SQL para eliminar las tablas
        $sentencias_delete = array(
            "DROP TABLE IF EXISTS " . Cuenta::$tableName,
            "DROP TABLE IF EXISTS " . Roles::$tableName,
            "DROP TABLE IF EXISTS " . Usuario::$tableName,
            "DROP TABLE IF EXISTS " . Nadador::$tableName,
            "DROP TABLE IF EXISTS " . Tiempos::$tableName,
            "DROP TABLE IF EXISTS " . Metros::$tableName,
            "DROP TABLE IF EXISTS " . Pruebas::$tableName,
            "DROP TABLE IF EXISTS " . self::TABLA_SERIE,
            "DROP TABLE IF EXISTS " . self::TABLA_EVENTO,
            "DROP TABLE IF EXISTS " . self::TABLA_COMPETENCIA,
            "DROP TABLE IF EXISTS " . self::TABLA_INSTITUCION,
            "DROP TABLE IF EXISTS " . self::TABLA_INSTITUCION_NADADOR,
            "DROP TABLE IF EXISTS " . self::TABLA_COMPTENCIA_EVENTO,
            "DROP TABLE IF EXISTS " . self::TABLA_LOGS
        );
    
        // Ejecutar cada sentencia DELETE
        foreach ($sentencias_delete as $sentencia) {
            $statement = Flight::db()->prepare($sentencia);
            $statement->execute();
        }
        Flight::json("Tablas eliminadas correctamente.");
    }
    
    public static function export() {
        // Tablas y sus sentencias SQL correspondientes
        $tablas = array(
            Nadador::$tableName => "SELECT * FROM " . Nadador::$tableName,
            Tiempos::$tableName => "SELECT * FROM " . Tiempos::$tableName,
            Metros::$tableName => "SELECT * FROM " . Metros::$tableName,
            Pruebas::$tableName => "SELECT * FROM " . Pruebas::$tableName,
            self::TABLA_SERIE => "SELECT * FROM " . self::TABLA_SERIE,
            self::TABLA_EVENTO => "SELECT * FROM " . self::TABLA_EVENTO,
            self::TABLA_COMPETENCIA => "SELECT * FROM " . self::TABLA_COMPETENCIA,
            self::TABLA_INSTITUCION => "SELECT * FROM " . self::TABLA_INSTITUCION,
            self::TABLA_INSTITUCION_NADADOR => "SELECT * FROM " . self::TABLA_INSTITUCION_NADADOR,
            self::TABLA_COMPTENCIA_EVENTO => "SELECT * FROM " . self::TABLA_COMPTENCIA_EVENTO,
            self::TABLA_LOGS => "SELECT * FROM " . self::TABLA_LOGS,
            Usuario::$tableName => "SELECT * FROM " . Usuario::$tableName,
            Cuenta::$tableName => "SELECT * FROM " . Cuenta::$tableName,
            Roles::$tableName => "SELECT * FROM " . Roles::$tableName
            // Añade aquí más tablas según sea necesario
        );
        // Array para almacenar los datos de cada tabla
        $datos_por_tabla = array();

        // Iterar sobre cada tabla y obtener sus datos
        foreach ($tablas as $tabla => $sentencia_sql) {
            $statement = Flight::db()->prepare($sentencia_sql);
            $statement->execute();
            $datos = $statement->fetchAll(PDO::FETCH_ASSOC);
            $datos_por_tabla[$tabla] = $datos;
        }

        // Convertir el array de datos a formato JSON
        $datos_json = json_encode($datos_por_tabla, JSON_PRETTY_PRINT);

        // Configurar cabeceras HTTP para la descarga del archivo
        header('Content-Type: application/json');
        header('Content-Disposition: attachment; filename="datos.json"');
        header('Pragma: no-cache');
        header('Expires: 0');

        // Salida de los datos JSON
        echo $datos_json;

        // Detener la ejecución del script después de la descarga
        exit();
        // Flight::json("Tablas Exportadas correctamente.");

    }
    public static function importFromJson($json_file_path) {
        // Define el orden deseado de las tablas
        $tablaOrder =array(
            Usuario::$tableName,
            Roles::$tableName,
            Cuenta::$tableName,
            Nadador::$tableName,
            Tiempos::$tableName,
            Metros::$tableName,
            Pruebas::$tableName,
            self::TABLA_SERIE,
            self::TABLA_EVENTO,
            self::TABLA_COMPETENCIA,
            self::TABLA_INSTITUCION,
            self::TABLA_INSTITUCION_NADADOR,
            self::TABLA_COMPTENCIA_EVENTO,
            self::TABLA_LOGS
        );
    
        // Leer el contenido del archivo JSON
        $json_data = file_get_contents($json_file_path);
        
        // Decodificar el JSON a un array asociativo
        $datos_por_tabla = json_decode($json_data, true);
        
        // Iterar sobre cada tabla en el orden especificado
        foreach ($tablaOrder as $tabla) {
            // Verificar si la tabla existe en el array de datos
            if (isset($datos_por_tabla[$tabla])) {
                $datos = $datos_por_tabla[$tabla];
                // Verificar si hay datos para insertar
                if (!empty($datos)) {
                    // Preparar la sentencia de inserción
                    $columns = implode(',', array_keys($datos[0]));
                    $values_placeholder = rtrim(str_repeat('?,', count($datos[0])), ',');
                    $sql = "INSERT INTO $tabla ($columns) VALUES ($values_placeholder)";
                    $statement = Flight::db()->prepare($sql);
                    
                    // Insertar cada registro en la tabla
                    foreach ($datos as $registro) {
                        $statement->execute(array_values($registro));
                    }
                } else {
                    echo "No hay datos para insertar en la tabla $tabla.\n";
                }
            } else {
                echo "La tabla $tabla no existe en el archivo JSON.\n";
            }
        }
        
        echo "Datos importados correctamente.\n";
    }
    
    // Función auxiliar para verificar si una tabla existe en la base de datos
    private static function tablaExists($tabla) {
        $statement = Flight::db()->prepare("SHOW TABLES LIKE ?");
        $statement->execute([$tabla]);
        return $statement->rowCount() > 0;
    }
}
