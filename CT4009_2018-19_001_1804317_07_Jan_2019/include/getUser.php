<?php
session_regenerate_id(true);
if(!isset($_SESSION)){
    session_start();
    $_SESSION['user'] = 'guest';
    $user_name = $_SESSION['user'];
} else {
    $user_name = $_SESSION['user'];
}


?>