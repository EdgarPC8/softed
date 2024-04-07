<?php

class SqlService
{
    public static function editData($tableName, $updateObject, $idObject) {
        try {
            $updateProperties = get_object_vars($updateObject);
            $updateColumns = array_map(fn ($key, $value) => "$key = '$value'", array_keys($updateProperties), $updateProperties);
            $updateColumnsString = implode(",", $updateColumns);
            $idProperties = get_object_vars($idObject);
            $idConditions = array_map(fn ($key, $value) => "$key = '$value'", array_keys($idProperties), $idProperties);
            $idConditionString = implode(" AND ", $idConditions);
    
            $statement = Flight::db()->prepare("UPDATE $tableName SET $updateColumnsString WHERE $idConditionString");
            $statement->execute();
            return true;
        } catch (PDOException $e) {
            return false;
        }
    }
    
    public static function saveData($tableName,$objeto){
    try {
        $insertProperties = get_object_vars($objeto);
        $insertColumns = array_map(fn ($key, $value) => "$key", array_keys($insertProperties), $insertProperties);
        $columns = implode(",", $insertColumns);

        $insertColumns = array_map(fn ($key, $value) => "'$value'", array_keys($insertProperties), $insertProperties);
        $values = implode(",", $insertColumns);

        // $insertColumns = array_map(function ($value) {
        //     return ($value === null) ? "NULL" : "'" . $value . "'";
        // }, $insertProperties);
        // $values = implode(",", $insertColumns);

        $statement = Flight::db()->prepare("INSERT INTO $tableName ($columns) VALUES ($values)");

        $statement->execute();
        return Flight::db()->lastInsertId();
    } catch (PDOException $e) {
        return $e;
    }
}

    public static function deleteData($tableName, $conditionObject) {
        try {
            // Crear la cadena para la cláusula WHERE a partir de las propiedades del objeto $conditionObject
            $conditionProperties = get_object_vars($conditionObject);
            $conditionArray = array_map(fn ($key, $value) => "$key = '$value'", array_keys($conditionProperties), $conditionProperties);
            $conditionString = implode(" AND ", $conditionArray);
    
            $statement = Flight::db()->prepare("DELETE FROM $tableName WHERE $conditionString");
            $statement->execute();
            return true;
        } catch (PDOException $e) {
            return false;
        }
    }
    public static function selectData($tableName, $columns = [], $conditions = [], $groupBy = null, $orderBy = null) {
        try {
            $query = "SELECT ";
    
            if (!empty($columns)) {
                $query .= implode(", ", $columns);
            } else {
                $query .= "*";
            }
            
            $query .= " FROM $tableName";
    
            if (!empty($conditions)) {
                $query .= " WHERE ";
    
                $conditionStrings = [];
                foreach ($conditions as $column => $value) {
                    $conditionStrings[] = "$column = :$column";
                }
    
                $query .= implode(" AND ", $conditionStrings);
            }
    
            if ($groupBy !== null) {
                $query .= " GROUP BY $groupBy";
            }
    
            if ($orderBy !== null) {
                $query .= " ORDER BY $orderBy";
            }
    
            $statement = Flight::db()->prepare($query);
    
            foreach ($conditions as $column => $value) {
                $statement->bindValue(":$column", $value);
            }
    
            $statement->execute();
            $result = $statement->fetchAll();
            return $result;
        } catch (Exception $e) {
            return null;
        }
    }

    public static function selectDataBD($sentencia) {
        try {
            $statement = Flight::db()->prepare($sentencia);
            $statement->execute();
            $result = $statement->fetchAll();
            return $result;
           
        } catch (PDOException $e) {
            return false;
        }

    }
    
    
    
}
