var password = document.getElementById("txtPassword");
var confirmPassword = document.getElementById("txtConfirmPassword");
var userName = document.getElementById("txtUserName");
//var profilePicture = document.getElementById("imgPfp");


function validatePassword(){
    
    if(/\d/.test(password.value) === false){
        password.setCustomValidity("Password Must Contain at Least One Number");
    } else if(password.value.length < 6){
        password.setCustomValidity("Password Must Contain at Least 6 Characters");
    } else {
        password.setCustomValidity('');
    }
    
    if(password.value != confirmPassword.value) {
        confirmPassword.setCustomValidity("Passwords Do Not Match");
    } else {
        confirmPassword.setCustomValidity('');
    }
}
function validateUsername(){
    if(userName.value.indexOf(' ') != -1){
        userName.setCustomValidity("User Name Cannot Contain Whitespce");
    } else if(userName.value.toLowerCase() == 'administrator'){
        userName.setCustomValidity("Please Choose a Different User Name")
    }
    else{
        userName.setCustomValidity('');
    }
    
    
}

password.onchange = validatePassword;
confirmPassword.onkeyup = validatePassword;
userName.onchange = validateUsername;
//userName.onkeyup= validateUsername;

function checkFields(){ //checks that mandatory fields have been filled in the registry form
    
    formData = $('#formUserRegistration').serialize();
    // cancels the form submission
    event.preventDefault();
    console.log(formData);
    $.ajax({
        type: "POST",
        url: "registerDAO.php",
        data: formData+"&phpfunction=createUser",
        success: function(echoedMsg){
            if(echoedMsg=='true'){
                window.location="RegistrationSuccess.html";
            } else {
                $("#divMessage").html(echoedMsg);
            }
        },
        error: function(msg){
            console.log(msg);
        }
    });
 
}