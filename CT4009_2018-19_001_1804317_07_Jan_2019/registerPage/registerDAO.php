<?php

	if($_POST['phpfunction'] == 'createUser') { //calls createUser() from address bar
		createUser();
	}
	if($_GET['phpfunction'] == 'verifyUser') { //calls verifyUser() from address bar
		verifyUser();
	}

	function createUser() {
		$firstname = $_POST['firstName']; //grabs variables from userform on register.html
		$lastname = $_POST['lastName']; // ^
        $user_name = $_POST['userName']; // ^
		$email = $_POST['email']; // ^
		$pass = $_POST['password']; // ^
        $bio = $_POST['bio']; // ^
        
        if($bio == ""){
            $bio = 'This user has no bio.'; // sets 'empty' bio if bio is empty
        }
        
        $verificationcode = substr(md5(uniqid(rand(), true)), 16, 16); // creates unique, random, verification code
        
		include "../include/config.php"; // includes the config file to access glos databse
        
        $sql = "SELECT * FROM `tbl_user` WHERE email='$email'"; // prepares sql statment
        
        $query = mysqli_query($connection, $sql); // checks if email has been registered
        
        if(mysqli_num_rows($query) < 0){ // if at least one account registered on this email:
            echo "This email has already been registered.";
            $validation = false;
            //return;
        }

        $sql = "SELECT * FROM `tbl_user` WHERE User_Name='$username'"; // prepares sql statement

        $query = mysqli_query($connection, $sql); // checks if user name has been registered
        
        if(mysqli_num_rows($query) > 0){
            echo "This user name has already been registered.";
            $validation = false;
            //return;
        }
        /*
        $file_result = "";
        if ($_FILES["file"]["error"] > 0) {
            echo "Error Code: ", $_FILES["file"]["error"];
        } else {
            $file_result .= "Upload:" . $_FILES["file"]["name"] . "<br>" .
                                                "Type: " . $_FILES["file"]["type"] . "<br>" . 
                                                "Temp file:" . $_FILES["file"]["tmp_name"];
            
            move_uploaded_file($_FILES["file"]["tmp_name"],
                               "../images/uploads/" . $_FILES["file"]["name"]);
            echo $file_result;
        } 
        $validation = false; */
        
		if($validation){
		$sql = "INSERT INTO `tbl_user`".
            " values ".
            "('$firstname', '$lastname', '$user_name','$email' , '$pass', NOW(), '$verificationcode', '0', '0','$bio')"; // prepares sql statement to create user

		if(mysqli_query($connection, $sql)) { // if no error occurs
            if(mysqli_query($connection,"INSERT INTO `tbl_pfp` (User_Name) values ('$user_name')")){ // inserts user into profile picture table
			echo "Account Registered! Please Check Your E-mail";
            sendEmail($email, $verificationcode); // sends verification email
            } else {
                echo mysqli_error($connection); // displays any erorrs in 2nd script
            }} else {
                echo mysqli_error($connection); // displays any errors in 1st script
        }  
		mysqli_close($connection); // closes the connection
               }
	}

	function verifyUser() {
        $email = $_GET['email'];
        $verificationcode = $_GET['VerificationCode']; //takes previously defined verificaion code
        
        include "../include/config.php";
        
        $sql = "UPDATE `tbl_user`".
            "SET `IsVerified`='1' ".
            " WHERE email = '$email' AND verificationcode='$verificationcode'"; // prepares sql statement
        
        if(mysqli_query($connection, $sql)) {
            echo "Your account has been successfully verified";
        } else {
            echo mysqli_error($connection);
        }
	} 

	function sendEmail($emailTo, $verificationcode) { // creates email with verification code
		$from="s1804317@glos.ac.uk";
		$headers = 'MIME-Version: 1.0' . "\r\n";
		$headers .= 'Content-type: text/html; charset=iso-8859-1' . "\r\n";

		//Create email headers

		$headers .= 'From: '.$from. "\r\n".
			'Reply-To: '.$from."\r\n" .
			'X-Mailer: PHP/' . phpversion();

		// Compose the message of the email
		$body = 'Thank you for registering with SocMed. <br>';
		$body = $body.'Please click the link below to activate your account. <br>';
		$link = 'http://ct4009-matrot.studentsites.glos.ac.uk/CT4009_2018-19_001_1804317_07_Jan_2019/registerPage/registerDAO.php?'.
				'phpfunction=verifyUser&email='.$emailTo.
				'&VerificationCode='.$verificationcode;
		$link = '<a href="'.$link.'">Click here</a>';
		$body = $body.$link;
		$message = '<html><body>';
		$message .= $body;
		$message .= '</body></html>';

	}
    
?>