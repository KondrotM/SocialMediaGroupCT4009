function sendPost(){ //checks that mandatory fields have been filled in the registry form
    
    formData = $('#postForm').serialize();
    event.preventDefault();
    console.log(formData);
    $.ajax({
        type: "POST",
        url: "newPost.php",
        data: formData,
        success: function(echoedMsg){
            console.log(echoedMsg);
//            if(echoedMsg=='true'){
//                window.location="RegistrationSuccess.html";
//            } else {
//                $("#divMessage").html(echoedMsg);
//            }
        },
        error: function(msg){
            console.log(msg);
            console.log(msg['responseText']);
        }
    });
 
}