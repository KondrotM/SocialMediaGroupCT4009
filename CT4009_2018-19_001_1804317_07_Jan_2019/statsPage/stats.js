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
function logout(){
	localStorage.removeItem("loggedInData"); //removes the log in data
	localStorage.removeItem("selectedUserData"); //removes the log in data
	window.location.replace("../loginPage/login.html");
}
window.onload = function () { // ensures that the html loads before the javascript
	if (loggedInUsername != "administrator"){ // prevents non-admin users from accessing this page
		logout();
	}
	addUserList(accountList);
	for (userNames in accountList){
		statsPost(userNames, "day");
	}
	document.getElementById("txtUsername").onkeypress = function(e) { // detects if enter is pressed in the textarea - from stackoverflow
		var event = e || window.event;
		var charCode = event.which || event.keyCode;
		if ( charCode == '13' ) {
			searchUser();
		}
	}
}

function addUserList(userList){ //adds user divs, userList is an object containing the usernames as key values
	var parentDiv = document.getElementById("adminUsersBox");
	removeElementsByClass("container");
	for (lowerCaseUserName in userList){ //I coded this before setting all usernames to have lowercase in registration
		var userName = accountList[lowerCaseUserName].userName;
		var newDiv = document.createElement("div");
		newDiv.setAttribute("class", "container");
		var newContent = document.createElement("img");
		newContent.setAttribute("class", "profilePicture");
		newContent.setAttribute("alt", "Avatar");
		if (accountList[lowerCaseUserName].profilePicture == "pic1.png"){
			newContent.setAttribute("src", "../images/pic1.png"); //default image
		}
		else{
			dataImage = localStorage.getItem(userName+accountList[lowerCaseUserName].profilePicture);
			newContent.setAttribute("src", "data:image/png;base64,"+dataImage);
		}
		newDiv.appendChild(newContent);
		newContent = document.createElement("div");
		newContent.setAttribute("class", "user");
		var newContent2 = document.createTextNode(accountList[lowerCaseUserName].firstName + " " + accountList[lowerCaseUserName].lastName + " | " + userName);
		newContent.appendChild(newContent2);
		newDiv.appendChild(newContent);
		newContent = document.createElement("p");
		newContent2 = document.createTextNode(accountList[lowerCaseUserName].bio);
		newContent.appendChild(newContent2);
		newDiv.appendChild(newContent);
		newContent2 = document.createElement("br");
		newContent.appendChild(newContent2);
		newContent2 = document.createElement("small");
		var newContent3 = document.createTextNode("Number of posts in last");
		newContent2.appendChild(newContent3);
		newContent3 = document.createElement("br");
		newContent2.appendChild(newContent3);
		newContent3 = document.createElement("button");
		newContent3.setAttribute("onmousedown", `statsPost('${userName}', 'day')`);
		newContent3.setAttribute("id", [userName+"statsDay"])
		newContent3.setAttribute("disabled", "true");
		var newContent4 = document.createTextNode("Day");
		newContent3.appendChild(newContent4);
		newContent2.appendChild(newContent3);
		newContent3 = document.createElement("button");
		newContent3.setAttribute("onmousedown", `statsPost('${userName}', 'week')`);
		newContent3.setAttribute("id", [userName+"statsWeek"])
		var newContent4 = document.createTextNode("Week");
		newContent3.appendChild(newContent4);
		newContent2.appendChild(newContent3);
		newContent3 = document.createElement("button");
		newContent3.setAttribute("onmousedown", `statsPost('${userName}', 'alltime')`);
		newContent3.setAttribute("id", [userName+"statsAlltime"])
		var newContent4 = document.createTextNode("All Time");
		newContent3.appendChild(newContent4);
		newContent2.appendChild(newContent3);
		newContent3 = document.createTextNode(" : ")
		newContent2.appendChild(newContent3);
		newContent3 = document.createElement("span");
		newContent3.setAttribute("id", [userName+"statsPosts"])
		newContent2.appendChild(newContent3);
		newContent.appendChild(newContent2);
		newContent2 = document.createElement("br");
		newContent.appendChild(newContent2);
		newContent2 = document.createElement("button");
		newContent3 = document.createTextNode("Ban User");
		newContent2.appendChild(newContent3);
		newContent2.setAttribute("onmousedown", `banUser('${userName}')`);
		newContent.appendChild(newContent2);
		newDiv.appendChild(newContent);
		parentDiv.appendChild(newDiv);
		statsPost(lowerCaseUserName, "day");
	}
}
function banUser(userName, date){
	var banCheck = confirm("Are you sure you want to ban "+userName+"?"); // prompts the admin
	if (banCheck){ //if yes is clicked
		delete accountList[userName];
		if (typeof bannedUsers == "string"){ // with only 1 value in the array, saving/loading in local storage seems to convert the value to a string, which causes bannedUsers.push() to produce an error
			bannedUsers = bannedUsers.split(" ");
		}
		bannedUsers.push(userName.toLocaleLowerCase()); //must be all lower case as string comparisons are case sensitive
		localStorage.setItem("bannedUsersData", bannedUsers);
		localStorage.setItem("saveData", JSON.stringify(accountList));
		alert("User banned");
		location.reload();
	}
}
function removeElementsByClass(className){ // removes all elements with a certain class name - from stackoverflow
    var elements = document.getElementsByClassName(className);
    while(elements.length > 0){
        elements[0].parentNode.removeChild(elements[0]);
    }
}

function statsPost(userName, sort){
	if(sort == "day"){
		var postsDay = 0; //reset the value to 0
		var postDate;
		var currentdate = new Date();
		for (z in accountList[userName].posts){
			postDate = new Date(accountList[userName].posts[z].date);
			if (currentdate - postDate <= 86400000){ // milliseconds in a day
				postsDay++; //the value of postsDay will be the number of posts that meet this conditional statement (posted within the last day)
			}
		}
		document.getElementById([userName+"statsPosts"]).innerHTML = postsDay;
		document.getElementById([userName+"statsDay"]).disabled = true; //disables the clicked button and enables the other buttons
		document.getElementById([userName+"statsWeek"]).disabled = false;
		document.getElementById([userName+"statsAlltime"]).disabled = false;
	}
	else if(sort == "week"){
		var postsWeek = 0;
		var postDate;
		var currentdate = new Date();
		for (z in accountList[userName].posts){
			postDate = new Date(accountList[userName].posts[z].date);
			if (currentdate - postDate <= 604800000){ // milliseconds in a week
				postsWeek++;
			}
		}
		document.getElementById([userName+"statsPosts"]).innerHTML = postsWeek;
		document.getElementById([userName+"statsDay"]).disabled = false;
		document.getElementById([userName+"statsWeek"]).disabled = true;
		document.getElementById([userName+"statsAlltime"]).disabled = false;
	}
	else if(sort == "alltime"){
		var postsAlltime = 0;
		for (z in accountList[userName].posts){
			postsAlltime = Object.keys(accountList[userName].posts).length;
		}
		document.getElementById([userName+"statsPosts"]).innerHTML = postsAlltime;
		document.getElementById([userName+"statsDay"]).disabled = false;
		document.getElementById([userName+"statsWeek"]).disabled = false;
		document.getElementById([userName+"statsAlltime"]).disabled = true;
	}
}

function searchUser(){
	var searchInput = document.getElementById("txtUsername").value;
	var searchUsersObj = {};
	if (searchInput != ""){ // search won't perform when no value is inputted
		for (userNames in accountList){
			if (userNames.indexOf(searchInput) > -1){
				searchUsersObj[userNames] = true;
			}
		}
		addUserList(searchUsersObj);
	}
	else{
		addUserList(accountList); //when there is no value for the search, it just shows all users
	}
}