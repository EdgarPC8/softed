<?php
    ini_set('display_errors', 1);
    ini_set('display_errors', 1);
    error_reporting(E_ALL);
    class DataBase {

        protected $connection_db;

        public function __construct ($connection) {
            $this->connection_db = $connection;
        }

        public function connection() {
            $this->connection_db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            return $this->connection_db;
        }

        public function getDataDb($tableName, $columns="*", $condition="", $orderBy="", $limit="") {
            $statement = $this->connection_db->prepare(
                "SELECT $columns FROM $tableName WHERE 1=1 $condition $orderBy $limit"
            );
             

            
            $statement->execute();
            $rows = $statement->fetchAll(PDO::FETCH_ASSOC);
            return $rows;
        }

        public function remove($tableName, $idCampo, $idUser) {
            $statement = $this->connection_db->prepare(
                "DELETE FROM $tableName WHERE $idCampo=$idUser"
            );
            $statement->execute();
        }

        public function addNewEntity($tableName, $userDatas) {
            $columns = implode(",", array_keys($userDatas));
            $values = implode("','", array_values($userDatas));
            
            $statement = $this->connection_db->prepare("INSERT INTO $tableName ($columns) VALUES ('{$values}')");
            $statement->execute();

            $last_id = $this->connection_db->lastInsertId();
            return $last_id;
        }

        public function updateDatas($tableName, $datasUpdate, $id) {
            $datas = array_map(fn ($key, $value) => "$key = '$value'", array_keys($datasUpdate), $datasUpdate);
            $newValues = implode (",", $datas);
            // echo $newValues;
            // return $newValues;
            $statement = $this->connection_db->prepare("UPDATE $tableName SET $newValues WHERE $id");
            $statement->execute();
        }

        


        

        
    }

?>