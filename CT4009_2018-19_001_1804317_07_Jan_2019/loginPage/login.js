var accountList = {};
var bannedUsers = [];
var admin = {
	username: "administrator",
	password: "okokok89"
};
var loggedInUsername;
if (JSON.parse(localStorage.getItem("saveData")) !== null){ // if an account has already been registered, it loads the account list
	accountList = JSON.parse(localStorage.getItem("saveData"));
}
if (localStorage.getItem("loggedInData") !== null){ // checks if an account was previously logged in
	loggedInUsername = localStorage.getItem("loggedInData");
}
if (localStorage.getItem("bannedUsersData") !== null){ // checks the list of banned usernames
	bannedUsers = localStorage.getItem("bannedUsersData");
}
if (loggedInUsername !== undefined){
	if (loggedInUsername != admin.username){
		redirectLoggedInUser();
	}
	else{
		redirectAdmin();
	}
}
function checkLogin(){ // checks log in fields
	var inputUserName = document.getElementById("txtUserName").value;
	var inputPassword = document.getElementById("txtPassword").value;
	var userNameMatched = false;
	for (x in accountList){ // checks if the inputted username matches any usernames in the object
		if(inputUserName.toLowerCase() == accountList[x].userName.toLowerCase()){ // no case sensitive disceprancies will occur as it will compare two strings in full upper case
			userNameMatched = true;
			var userName = inputUserName.toLowerCase();
		}
	}
	if (userNameMatched == true){
		if (inputPassword != ""){ // checks if it has a value, otherwise the line below will give an error
			if (inputPassword == accountList[userName].password){
				login(userName);
			}
			else{
				alert("Invalid password");
			}
		}
		else{
			alert("Invalid password");
		}
	}
	else{
		if (inputUserName == admin.username && inputPassword == admin.password){
			login(inputUserName);
		}
		else{
			if (bannedUsers.indexOf(inputUserName.toLocaleLowerCase()) > -1){
				alert("User banned");
			}
			else{
				alert("Invalid username");
			}
		}
	}
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