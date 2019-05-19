<?php
//Mysqli
    $servername = "localhost";
    $username = "s1804317_user";
    $password = "1335so9u6dbu";    
    $dbname = "s1804317_flogger";

//Create connection
$connection = new mysqli($servername, $username, $password, $dbname);


//Check connection
if ($connection->connect_error) {
    die("Connection failed: ". $conn->connect_error);
}
?>