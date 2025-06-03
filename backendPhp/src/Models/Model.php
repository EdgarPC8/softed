<?php

class Model {
    protected static $table; // Nombre de la tabla
    protected static $tableAttributes = []; // Atributos para la estructura de la tabla
    protected static $primaryKey = 'id';
    protected static $foreignKeys = []; // Soporte para claves foráneas

    public $attributes = []; // Atributos de la instancia

    public function __construct($attributes = []) {
        $this->attributes = $attributes; // Inicializa los atributos de la instancia
    }
    public static function getTableName() {
        return static::$table; // Usa static:: para acceder a la propiedad estática
    }

    public static function sync($dropIfExists = false) {
        $db = Flight::db();
        
        // Si se desea eliminar la tabla existente
        if ($dropIfExists) {
            // Deshabilitar la verificación de claves foráneas
            $db->exec("SET FOREIGN_KEY_CHECKS = 0;");
            // Eliminar la tabla si existe
            $db->exec("DROP TABLE IF EXISTS " . static::$table . ";");
        }

        // Crear la tabla si no existe
        $query = "CREATE TABLE IF NOT EXISTS " . static::$table . " (";
        $columns = [];

        // Añadir clave primaria primero
        if (static::$primaryKey == 'id') {
            $columns[] = static::$primaryKey . " BIGINT AUTO_INCREMENT PRIMARY KEY";
        } else {
            $columns[] = static::$primaryKey . " VARCHAR(255) PRIMARY KEY";
        }

        // Definir los atributos de la tabla (columnas)
        foreach (static::$tableAttributes as $column => $type) {
            $columns[] = "$column $type";
        }

        // Agregar claves foráneas si existen
        // foreach (static::$foreignKeys as $fk) {
        //     $columns[] = "FOREIGN KEY (`{$fk['column']}`) REFERENCES `{$fk['references']}`(`{$fk['on']}`) ON DELETE {$fk['onDelete']}";
        // }

        // Completar la consulta
        $query .= implode(", ", $columns) . ");";

        // Ejecutar la consulta
        $stmt = $db->prepare($query);
        $stmt->execute();

        // Habilitar la verificación de claves foráneas nuevamente
        $db->exec("SET FOREIGN_KEY_CHECKS = 1;");
    }

    // Método para agregar un atributo (columna) a un modelo
    public static function addColumn($columnName, $type) {
        static::$tableAttributes[$columnName] = $type; // Se usa tableAttributes
    }

    // Guardar el modelo en la base de datos
    public function save() {
        if (isset($this->attributes[static::$primaryKey])) {
            return $this->update();
        } else {
            return $this->create();
        }
    }
    protected function create() {
            $columns = implode(", ", array_keys($this->attributes));
            $placeholders = implode(", ", array_fill(0, count($this->attributes), '?'));
            $query = "INSERT INTO " . static::$table . " ($columns) VALUES ($placeholders)";
            
            $stmt = Flight::db()->prepare($query);
            $stmt->execute(array_values($this->attributes));
    
            if (static::$primaryKey == 'id') {
                $this->attributes['id'] = Flight::db()->lastInsertId();
            }
            
            return $this->attributes;
    }
    public function update($newAttributes = []) {
        // Combina los atributos nuevos con los actuales
        foreach ($newAttributes as $key => $value) {
            $this->attributes[$key] = $value;
        }
    
        // Prepara las columnas para la consulta SQL
        $columns = implode(" = ?, ", array_keys($this->attributes)) . " = ?";
        $query = "UPDATE " . static::$table . " SET $columns WHERE " . static::$primaryKey . " = ?";
    
        // Prepara y ejecuta la consulta
        $stmt = Flight::db()->prepare($query);
        $stmt->execute(array_merge(array_values($this->attributes), [$this->attributes[static::$primaryKey]]));
    
        return $this->attributes; // Retorna los atributos actualizados o la instancia
    }
    
 
    public function delete() {
        $query = "DELETE FROM " . static::$table . " WHERE " . static::$primaryKey . " = ?";
        $stmt = Flight::db()->prepare($query);
        $stmt->execute([$this->attributes[static::$primaryKey]]);
        return $stmt->rowCount();
    }
     // Método genérico para definir relaciones belongsTo
     public function belongsTo($relatedModel, $foreignKey, $localKey = 'id',$options=[]) {
        $relatedId = $this->attributes[$foreignKey] ?? null;

        if ($relatedId === null) {
            return null;
        }

        return $relatedModel::find($relatedId,$options);
    }
    // Método para cargar relaciones automáticamente
    public function loadRelations($tableName,$options) {
        // foreach (static::$foreignKeys as $relation => $config) {
            $config=static::$foreignKeys[$tableName];
            $relatedModel = $config['model'];
            $foreignKey = $config['foreign_key'];
            $localKey = $config['local_key'] ?? 'id';
            $this->attributes[$tableName] = $this->belongsTo($relatedModel, $foreignKey, $localKey,$options)->attributes;
        // }
    }
    public static function find($id, $options = []) {
        // Inicializar columnas, condiciones, limit, orderBy e include
        $columns = isset($options['columns']) ? implode(', ', $options['columns']) : '*';
        $conditions = isset($options['conditions']) ? $options['conditions'] : [];
        $limit = isset($options['limit']) ? intval($options['limit']) : null;
        $orderBy = isset($options['orderBy']) ? $options['orderBy'] : null;
        // $include = isset($options['include']) ? $options['include'] : [];
    
        // Construir la consulta base
        $query = "SELECT $columns FROM " . static::$table . " WHERE " . static::$primaryKey . " = ?";
        
        // Inicializar los valores con el ID
        $values = [$id];
    
        // Si hay condiciones adicionales, agregarlas a la consulta
        if (!empty($conditions)) {
            foreach ($conditions as $column => $value) {
                $query .= " AND $column = ?";
                $values[] = $value;
            }
        }
    
        // Agregar ORDER BY si se especifica
        if ($orderBy) {
            $query .= " ORDER BY " . $orderBy;
        }
    
        // Agregar LIMIT si se especifica
        if ($limit) {
            $query .= " LIMIT " . $limit; // Se asume que limit ya es un número
        }
    
        // Preparar y ejecutar la consulta
        $stmt = Flight::db()->prepare($query);
        $stmt->execute($values);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$row) {
            return null; // Si no se encuentra el registro
        }
    
        $result = new static($row);
    
        return $result;
    }
    public static function findAll($options = []) {
        // Convertir el array de columnas en una cadena separada por comas
        $columns = isset($options['columns']) ? implode(', ', $options['columns']) : '*';
        $include = isset($options['include']) ? $options['include'] : []; // Relaciones a incluir
        $conditions = isset($options['conditions']) ? $options['conditions'] : [];
        // Construir la consulta
        $query = "SELECT $columns FROM " . static::$table;
        $values = [];
          // Si hay condiciones, agregarlas a la consulta
        //   la condicion debe ser en string porque sino lo llena al objeto y no el value despues corregir eso
        if (!empty($conditions)) {
            $query .= " WHERE ";
            foreach ($conditions as $column => $value) {
                $query .= "$column = ? AND ";
                $values[] = $value;
            }
            $query = rtrim($query, ' AND '); // Eliminar el último "AND"
        }
        $stmt = Flight::db()->prepare($query);
        $stmt->execute($values);
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $datos=[];
        foreach ($rows as $key => $result) {
            if ($result) {
                // Crear una instancia del modelo con los datos
                $instance = new static($result);
                 if (!empty($include)) {
                    foreach ($include as $relation) {
                        $optionsEntidad =[];
                        if(isset($relation['columns'])) {
                            $optionsEntidad=[
                                "columns"=>$relation['columns']
                            ];
                        }
                        $instance->loadRelations($relation['model'],$optionsEntidad);
                    }
                }
                $datos[]= $instance->attributes;
            }
        }

        // if(count($datos)===1){
        //     return $datos[0];
        // }
    
        return $datos;
    }

}

    
   