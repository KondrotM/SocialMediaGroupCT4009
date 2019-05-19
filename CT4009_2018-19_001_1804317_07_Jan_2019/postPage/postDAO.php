<?php
session_start();
$post = 1;

function getVisibleUsers(){
    $visibleUsers = [];
//    $sql = "SELECT * FROM `tbl_posts` WHERE "
// remember to append current user
}

function logout(){
    session_destroy();
}

function getVisiblePosts(){
    session_start();
    include "../include/config.php";
    $user_name = $_SESSION['user'];
    $index = 0;
    $data = array();
    $sql = "SELECT * FROM `tbl_posts` WHERE User_Name='$user_name' ORDER BY post_id DESC";
    $query = mysqli_query($connection, $sql);
//    $row = mysqli_fetch_assoc($query);
    if($query) {
    while($row = mysqli_fetch_assoc($query)){
        $data[$index][0] = $row['post_id'];
        $data[$index][1] = $row['User_Name'];
        $data[$index][2] = $row['post_text'];
        $data[$index][3] = $row['post_image'];
        $data[$index][4] = $row['post_time'];
        $index++;
    }
        echo json_encode($data);
        session_write_close();
}
    
    //$rows = mysqli_fetch_assoc($query);
    //echo $rows;    
}


if($_POST['phpfunction'] == 'getVisiblePosts') {
    getVisiblePosts();
    $post = 0;
} 
if ($_POST['phpfunction'] == 'logout') {
    logout();
    $post = 0;
}

if($post){
    session_regenerate_id(true);
    include "../include/config.php"; // connection to server
    $user_name = $_SESSION['name']; // user name set as variable
    $message = $_POST['message']; // grabs message from form
    $message = addslashes($message); // makes sure a rogue apostrophe ' doesn't break the code
    $file_result = ""; // debug 
    $filepath = ""; // declare image filepath

    
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
            echo "Picture uploaded successfully <br>";
            echo '<a href="post.html">Click here to return <br></a>';
        } else {
            echo mysqli_error($connection);
            echo '<a href="posts.html">Click here to return</a>';
        }
            
    
    } else {
        $file_result .= "No File Uploaded or Invalid File ";
        $file_result .= "Error Code: " . $_FILES["file"]["error"] . "<br>";
    }
    echo $file_result;
    
}






?>