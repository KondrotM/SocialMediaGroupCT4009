<?php
if($_POST['phpfunction'] = addFriend){
    addFriend();
} 

function addFriend(){
    session_start();
    include "../include/config.php";
    $req_user = $_SESSION['user'];
    $rec_user = $_POST['addedUserName'];
    $allvars = $_POST;
    
    $sql = "SELECT isFriends FROM `tbl_friends` WHERE User_Name1 = '$rec_user' AND User_Name2 = '$req_user'";
    $query = mysqli_query($connection, $sql);
    if(mysqli_num_rows($query) > 0) {
        $row = mysqli_fetch_assoc($query);
        if($row['isFriends'] == 0) {
            $sql = "UPDATE `tbl_friends` SET isFriends = 1 WHERE User_Name1 = '$rec_user' AND User_Name2 = '$req_user'";
            $query = mysqli_query($connection, $sql);
            if($query){
                echo "Friend Added!";
            } 
        } else {
            echo "Already Friends 1";
        } 
    } else {
        $sql = "SELECT User_Name FROM `tbl_user` WHERE User_Name='$rec_user'";
        $query = mysqli_query($connection, $sql);
        if(mysqli_num_rows($query) > 0){
            $sql = "SELECT isFriends FROM `tbl_friends` WHERE User_Name1='$req_user' AND User_Name2 = '$rec_user'";
            $query = mysqli_query($connection, $sql);
            if(mysqli_num_rows($query) > 0){
                $row = mysqli_fetch_assoc($query);
                if($row['isFriends'] == 0) {
                    echo "Friend Request Already Sent";
                } else {
                    echo "Already Friends 2"; 
                } 
            } else {
                $sql = "INSERT INTO `tbl_friends` (User_Name1, User_Name2) VALUES ('$req_user','$rec_user')";  
                $query = mysqli_query($connection, $sql);
                if($query){
                    echo "Friend Request Sent!";
                }
            }
        } else {
//            echo "User Doesn't Exist";
            echo "User Doesn't Exist: ",$rec_user," ",$req_user," ",print_r($allvars);
        }
    }
}


?>