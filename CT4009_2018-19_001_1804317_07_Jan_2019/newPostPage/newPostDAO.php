<?php

session_start();
include "../include/config.php";

$user_name = $_SESSION['user'];
$message = $_POST['message'];
$message = addslashes($message);
$filepath = "";

$sql = "SELECT `post_id` FROM `tbl_posts`ORDER BY `post_id` DESC LIMIT 1"; // selects last post ID
    $query = mysqli_query($connection,$sql); 
    $row = mysqli_fetch_assoc($query);
    $postID = $row['post_id'];
    $postID++; // increments last ID for unique file name
    if($_FILES["file"]["error"] == 0) {
        $file_result .=
        "Upload: " . $_FILES["file"]["name"] . "<br>" .
        "Type: " . $_FILES["file"]["type"] . "<br>" .
        "Size: " . $_FILES["file"]["size"] . "<br>" .
        "Temp file: " . $_FILES["file"]["tmp_name"] . "<br>"; // debug stats
    
        move_uploaded_file($_FILES["file"]["tmp_name"], "../images/postimg/" . $postID . $_FILES["file"]["name"]); // uploads file to server
        
        $filepath .= 
            "../images/postimg/" .
            $postID .
            $_FILES["file"]["name"]; // filepath as a string
        
        $sql = "INSERT INTO `tbl_posts`(`User_Name`, `post_text` ,`post_image`, `post_time`) VALUES ('$user_name','$message','$filepath',CURRENT_TIMESTAMP)"; // uploads post row to SQL table
        if(mysqli_query($connection, $sql)) {
            echo "Post uploaded successfully <br>";
            echo '<a href="../postPage/post.html">Click here to return <br></a>';   
        } else {
            echo mysqli_error($connection);
            echo '<a href="posts.html">Click here to return</a>';
            
            
        } 
    
    } else {
        $file_result .= "No File Uploaded or Invalid File ";
        $file_result .= "Error Code: " . $_FILES["file"]["error"] . "<br>";
    }


?>