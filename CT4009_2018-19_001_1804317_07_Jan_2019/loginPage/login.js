var admin = {
	username: "administrator",
	password: "okokok89"
};

//if (loggedInUsername !== undefined){
//	if (loggedInUsername != admin.username){
//		redirectLoggedInUser();
//	}
//	else{
//		redirectAdmin();
//	}
//}


function checkLogin(){ // checks log in fields
    formData = $('#formUserLogin').serialize();
    // cancels the form submission, otherwise window reloads
    event.preventDefault();
    console.log(formData);
    $.ajax({
        type: "POST",
        url: "loginDAO.php",
        data: formData+"&phpfunction=checkLogin",
        success: function(echoedMsg){
            if(echoedMsg=='true'){
                window.location="../postPage/post.html";
            } else {
                $("#divMessage").html(echoedMsg);
            }
        },
        error: function(msg){
            console.log(msg);
        }
    })
}
    
function login(userName){ // logs in if the account details were entered correctly
	localStorage.setItem("loggedInData", userName);
	if (userName == admin.username){
		redirectAdmin();
	}
	else{
		redirectLoggedInUser();
	}
	
}

function redirectLoggedInUser(){
	window.location.replace("../postPage/post.html");
}

function redirectAdmin(){
	window.location.replace("../reportsPage/reports.html"); // redirects the user to the admin page
}