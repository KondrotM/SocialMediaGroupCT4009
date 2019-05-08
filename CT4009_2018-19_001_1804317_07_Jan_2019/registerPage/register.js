var accountList = {};
var bannedUsers = [];
if (localStorage.getItem("bannedUsersData") !== null){ // checks the list of banned usernames
	bannedUsers = localStorage.getItem("bannedUsersData");
}
if (JSON.parse(localStorage.getItem("saveData")) !== null){ // if an account has already been registered, it loads the account list
	accountList = JSON.parse(localStorage.getItem("saveData"));
}

function checkFields(){ //checks that mandatory fields have been filled in the registry form
	var inputFirstName = document.getElementById("txtFirstName").value;
	var inputLastName = document.getElementById("txtLastName").value;
	var inputUserName = document.getElementById("txtUserName").value;
	var inputEmail = document.getElementById("txtEmail").value;
	var inputPassword = document.getElementById("txtPassword").value;
	var inputConfirmPassword = document.getElementById("txtConfirmPassword").value;
	var inputProfilePicture = document.getElementById("imgPpf").value;
	var inputBio = document.getElementById("txtBio").value;
	if (inputFirstName !== "" && inputLastName !== "" && inputUserName !== ""){ // ensures that name fields aren't blank
		var userNameTaken = false;
		var emailTaken = false;
		for (x in accountList){ // checks if the username or email has been taken by iterating through the object
			if(inputUserName.toLowerCase() == accountList[x].userName.toLowerCase()){ // no case sensitive disceprancies will occur as it will compare two strings in full upper case
				userNameTaken = true;
			}
			if(inputEmail.toLowerCase() == accountList[x].email.toLowerCase()){
				emailTaken = true;
			}
		}
		if(userNameTaken == false){
			if (inputUserName != "administrator"){
				if (bannedUsers.indexOf(inputUserName.toLocaleLowerCase()) < 0){
					if (emailTaken == false){
						if(inputUserName.indexOf(' ') == -1){ // ensures the username doesn't contain a space
							if (inputEmail.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)){ // ensures that the email has valid formating - from w3resource email validation
								if(inputPassword === inputConfirmPassword){ // checks if the passwords match
									if(inputPassword.length >= 6){ // checks if the password has atleast 6 characters
										if(/\d/.test(inputPassword) === true){ // checks if the password contains a number
											var registeredAccount = {
												firstName: inputFirstName,
												lastName: inputLastName,
												userName: inputUserName.toLocaleLowerCase(),
												email: inputEmail,
												password: inputPassword,
												profilePicture: inputProfilePicture.split(/(\\|\/)/g).pop(), // takes only the file name, no file path
												bio: inputBio,
												friends: {},
												friendRequests: {},
												posts: {}
											};
											if(inputProfilePicture === ""){ // if no picture is uploaded, sets it to a stock image
												registeredAccount.profilePicture = "pic1.png";
											}
											if(inputBio === ""){ // if no bio is set, sets it to "no bio"
												registeredAccount.bio = "No bio";
											}
											registerAccount(registeredAccount);
										}
										else{
											alert("Password must contain atleast 1 number");
										}
									}
									else{
										alert("Password must contain atleast 6 characters");
									}
								}
								else{
									alert("Passwords don't match");
								}
							}
							else{
								alert("Invalid Email");
							}
						}
						else{
							alert("Username cannot contain whitespace");
						}
					}
					else{
						alert("Email taken");
					}
				}
				else{
					alert("User has been banned");
				}
			}
			else{
				alert("Please pick a different username");
			}
		}
		else{
			alert("Username taken");
		}
	}
}

function registerAccount(details){
	var saveData = accountList; // fetches currently saved accounts
	saveData[details.userName.toLowerCase()] = details; // adds a new entry to the object
	accountList = saveData; // updates the account list
	localStorage.setItem("saveData", JSON.stringify(saveData)); // writes the save data to local storage
	if(details.profilePicture != "pic1.png"){ // if a profile picture was set
		var imgData = getBase64Image(displayedUploadedImg);
		localStorage.setItem([details.userName+details.profilePicture], imgData); // details.profilePicture is a string equal to the username and the name/format of the saved file, e.g. lemmy57dog.png
	}
}

function readURL(input){ // displays image to be converted to base64 string, but the image is hidden - from stackoverflow
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            document.getElementById('displayedUploadedImg').src =  e.target.result;
        }
        reader.readAsDataURL(input.files[0]);
    }
}

function getBase64Image(img){ //converts an image to base64 string - from stackoverflow
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    var dataURL = canvas.toDataURL("image/png");
    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
}

function createAccounts(){ //for testing purposes
	accountList = {
		lemmy57: {
			firstName: "Liam",
			lastName: "Gerwahrts",
			userName: "lemmy57",
			email: "liam@yahoo.com",
			password: "ilovelemon1",
			profilePicture: "pic1.png",
			bio: "I really love lemon!",
			friends: {},
			friendRequests: {},
			posts: {}
		},
		dabaws1221: {
			firstName: "Martin",
			lastName: "Varbanov",
			userName: "dabaws1221",
			email: "varbanov@yahoo.co.uk",
			password: "meGrass22",
			profilePicture: "pic1.png",
			bio: "I really love grass!",
			friends: {},
			friendRequests: {},
			posts: {}
		},
		cooliodj: {
			firstName: "Joshua",
			lastName: "Ramsay",
			userName: "cooliodj",
			email: "ramsay@gmail.com",
			password: "heyokay5",
			profilePicture: "pic1.png",
			bio: "No bio",
			friends: {},
			friendRequests: {},
			posts: {}
		},
		ville: {
			firstName: "Ville",
			lastName: "Sinki",
			userName: "ville",
			email: "ville@gmail.co.uk",
			password: "123456",
			profilePicture: "pic1.png",
			bio: "No bio",
			friends: {},
			friendRequests: {},
			posts: {}
		}
	}
	localStorage.setItem("saveData", JSON.stringify(accountList));
}