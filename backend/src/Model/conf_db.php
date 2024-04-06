<?php
    
    include 'Database.php';
    const NAMEDB = "natacion";
    const USERDB = "root";
    const PASSWORDDB = "";
    const HOSTDB = "localhost";
    // const TABLE = "paciente";
    $dsn = "mysql:dbname=".NAMEDB.";host=".HOSTDB."";
    
    try {
        $dbh = new PDO($dsn, USERDB, PASSWORDDB);
    } catch (PDOException $error) {
        echo "Conexión fallida:".$error->getMessage();
    }
    // echo "Conexión realizada"; 
    $connection = new DataBase($dbh);
    $connection->connection();
    //$datas = $connection->getDataDb("paciente", "*");
    //print_r($datas);


    

    
    
    
    

    
