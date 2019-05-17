<?php
    session_start();
    include "../include/config.php";
    $user_name = $_SESSION['name'];
    $message = $_POST['message'];
    $message = addslashes($message);
    $file_result = "";
    $filepath = "";

    
    $sql = "SELECT `post_id` FROM `tbl_posts`ORDER BY `post_id` DESC LIMIT 1";
    $query = mysqli_query($connection,$sql);
    $row = mysqli_fetch_assoc($query);
    $postID = $row['post_id'];
    $postID++;
    if($_FILES["file"]["error"] == 0) {
        $file_result .=
        "Upload: " . $_FILES["file"]["name"] . "<br>" .
        "Type: " . $_FILES["file"]["type"] . "<br>" .
        "Size: " . $_FILES["file"]["size"] . "<br>" .
        "Temp file: " . $_FILES["file"]["tmp_name"] . "<br>";
    
        move_uploaded_file($_FILES["file"]["tmp_name"], "../images/postimg/" . $postID . $_FILES["file"]["name"]);
        
        $filepath .= 
            "../images/postimg/" .
            $postID .
            $_FILES["file"]["name"];
        
        $sql = "INSERT INTO `tbl_posts`(`User_Name`, `post_text` ,`post_image`, `post_time`) VALUES ('$user_name','$message','$filepath',CURRENT_TIMESTAMP)";
        if(mysqli_query($connection, $sql)) {
            echo "Picture uploaded successfully";
        } else {
            echo mysqli_error($connection);
        }
            
    
    } else {
        $file_result .= "No File Uploaded or Invalid File ";
        $file_result .= "Error Code: " . $_FILES["file"]["error"] . "<br>";
    }
    echo $file_result;

    
?>
