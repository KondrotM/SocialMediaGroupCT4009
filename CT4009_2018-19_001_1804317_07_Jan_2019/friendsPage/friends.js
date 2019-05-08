var accountList = {};
var loggedInUsername;
if (JSON.parse(localStorage.getItem("saveData")) !== null){ // if an account has already been registered, it loads the account list
	accountList = JSON.parse(localStorage.getItem("saveData"));
}
if (localStorage.getItem("loggedInData") !== null){ // checks if an account was previously logged in
	loggedInUsername = localStorage.getItem("loggedInData");
}
window.onload = function () { // ensures that the html loads before the javascript
	addFriendRequestElements();
	addFriendsList();
};
function logout(){
	localStorage.removeItem("selectedUserData"); //removes the log in data
	localStorage.removeItem("loggedInData"); //removes the log in data
	window.location.replace("../loginPage/login.html");
}
function respondRequest(userName, match){ // whether the friend request is accepted or rejected
	if (match == true){
		delete accountList[loggedInUsername].friendRequests[userName]; // removes the friend request
		accountList[loggedInUsername].friends[userName] = {messages: {}};
		accountList[userName].friends[loggedInUsername] = {messages: {}};
	}
	else{
		delete accountList[loggedInUsername].friendRequests[userName];
	}
	localStorage.setItem("saveData", JSON.stringify(accountList));
	location.reload();
}
function addFriendRequestElements(){ //adds friend request divs
	var parentDiv = document.getElementById("friendRequestsBox");
	for (addedUserName in accountList[loggedInUsername].friendRequests){
		var newDiv = document.createElement("div");
		var newContent = document.createTextNode([accountList[addedUserName].firstName + " " + accountList[addedUserName].lastName]);
		newDiv.appendChild(newContent);
		newDiv.appendChild(document.createElement("br"));
		newContent = document.createTextNode([addedUserName]);
		newDiv.appendChild(newContent);
		newDiv.appendChild(document.createElement("br"));
		newContent = document.createElement("button");
		newContent.setAttribute("onmousedown", `respondRequest('${addedUserName}', true)`); // gives the button onmousedown="respondRequest(addedUserName, true)"
		var newContent2 = document.createTextNode("Accept");
		newContent.appendChild(newContent2);
		newDiv.appendChild(newContent);
		newContent = document.createElement("button");
		newContent.setAttribute("onmousedown", `respondRequest('${addedUserName}', false)`);
		newContent2 = document.createTextNode("Reject");
		newContent.appendChild(newContent2);
		newDiv.appendChild(newContent);
		newDiv.setAttribute("class", "container");
		var friendRequestQuantity = Object.keys(accountList[loggedInUsername].friendRequests).length;
		newDiv.setAttribute("id", [friendRequestQuantity]);
		if (friendRequestQuantity > 1){ // checks if you only have 1 friend
			var currentDiv = document.getElementById([friendRequestQuantity-1]);
			parentDiv.insertBefore(newDiv, currentDiv);
		}
		else{ // if you only have 1 friend, then it inserts the div below the submit user button in the body
			var currentDiv = document.getElementById("insertFriendBefore");
			parentDiv.insertBefore(newDiv, currentDiv);
		}
	}
}

function addFriendsList(){ //adds friend divs
	var parentDiv = document.getElementById("friendsListBox");
	for (userName in accountList[loggedInUsername].friends){
		var userFriend = accountList[userName];
		var newDiv = document.createElement("div");
		newDiv.setAttribute("class", "container");
		var newContent = document.createElement("img");
		newContent.setAttribute("class", "profilePicture");
		newContent.setAttribute("alt", "Avatar");
		if (userFriend.profilePicture == "pic1.png"){
			newContent.setAttribute("src", "../images/pic1.png"); //default image
		}
		else{
			dataImage = localStorage.getItem(userFriend.userName+userFriend.profilePicture);
			newContent.setAttribute("src", "data:image/png;base64,"+dataImage);
		}
		newDiv.appendChild(newContent);
		newContent = document.createElement("div");
		newContent.setAttribute("class", "user");
		var newContent2 = document.createTextNode(userFriend.firstName + " " + userFriend.lastName + " | " + userFriend.userName);
		newContent.appendChild(newContent2);
		newDiv.appendChild(newContent);
		newContent = document.createElement("p");
		newContent2 = document.createTextNode(userFriend.bio);
		newContent.appendChild(newContent2);
		newDiv.appendChild(newContent);
		newContent = document.createElement("span");
		newContent.setAttribute("onmousedown", `removeFriend('${userFriend.userName}')`);
		newContent.setAttribute("class", "removeFriend");
		newContent2 = document.createTextNode("Remove friend");
		newContent.appendChild(newContent2);
		newDiv.appendChild(newContent);
		parentDiv.appendChild(newDiv);
	}
}
function removeFriend(username){
	var checkRemove = confirm("Are you sure you want to remove "+username+" from your friends list?"); // prompt the user
	if(checkRemove){
		delete accountList[loggedInUsername].friends[username];
		delete accountList[username].friends[loggedInUsername];
		localStorage.setItem("saveData", JSON.stringify(accountList));
		location.reload();
	}
}