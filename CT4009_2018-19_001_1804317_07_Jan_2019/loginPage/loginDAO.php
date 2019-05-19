<?php
if($_POST['phpfunction'] == 'checkLogin') {
    checkLogin();
}

function checkLogin() {
    $user_name = $_POST['userName'];
    $user_password = $_POST['password'];
    $login = 0;
    
    include "../include/config.php";
    
    $sql = "SELECT * FROM `tbl_user` WHERE User_Name='$user_name'";
    $query = mysqli_query($connection,$sql);
    if(mysqli_num_rows($query) > 0){
        $sql = "SELECT * FROM `tbl_user` WHERE User_Name='$user_name' AND password='$user_password'";
        $query = mysqli_query($connection, $sql);
        if(mysqli_num_rows($query) > 0){
            $sql = "SELECT IsBanned FROM `tbl_user` WHERE User_Name='$user_name' AND password='$user_password'";
            $query = mysqli_query($connection, $sql);
            $row = mysqli_fetch_assoc($query);
            if($row['IsBanned']){
                echo "User is banned";
            } else{
                session_start();
                $_SESSION['user'] = $user_name;
                setcookie('user_cookie',$user_name, time() +(86400*30),"../");
                session_write_close();
                echo 'true';
                //header("Location: post.html");
                //break;
            }
        } else {
            echo "Incorrect Password";
        }
        
        
    } else {
        echo "Username not recognised ";        
    }
        
}

?>