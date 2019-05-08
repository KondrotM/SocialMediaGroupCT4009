var accountList = {};
var loggedInUsername;
var selectedUser;
if (JSON.parse(localStorage.getItem("saveData")) !== null){ // if an account has already been registered, it loads the account list
	accountList = JSON.parse(localStorage.getItem("saveData"));
}
if (localStorage.getItem("loggedInData") !== null){ // checks if an account was previously logged in
	loggedInUsername = localStorage.getItem("loggedInData");
}
if (localStorage.getItem("selectedUserData") !== null){ // checks last selected user
	selectedUser = localStorage.getItem("selectedUserData");
}
function logout(){
	localStorage.removeItem("loggedInData"); //removes the log in data
	localStorage.removeItem("selectedUserData"); //removes the log in data
	window.location.replace("../loginPage/login.html");
}
window.onload = function () { // ensures that the html loads before the javascript
	addFriendElementsLoaded(); // adds added friends to the contacts list
	addMessageElementsLoaded(); // adds sent messages for selected user
	if (selectedUser !== undefined){ // selects the last selected friend if it's not undefined i.e. when the page is refreshed
		if (isFriends(selectedUser)){
			selectFriend(selectedUser); //the user can only be select if he is friends with the logged in user
		}
	}
	document.getElementById("txtMessage").onkeypress = function(e) { // detects if enter is pressed in the textarea - from stackoverflow
		var event = e || window.event;
		var charCode = event.which || event.keyCode;
		if ( charCode == '13' ) {
			if (document.getElementById("txtMessage").value != ""){
				if (selectedUser != undefined){
					sendMessage()
				}
			}
			return false;
		}
	}
};

function isFriends(user){ // returns true if the logged in user is friends with the inputted username
	for (users in accountList[loggedInUsername].friends){
		if (accountList[user].userName == accountList[users].userName){
			return true;
		}
	}
	return false;
}

function addUser(){ // called when the "add" user button is pressed
	var addedUserName = document.getElementById("txtUsername").value;
	if(addedUserName !== loggedInUsername){ // checks that you're not trying to add yourself
		var userNameMatched = false;
		for (x in accountList){ //checks that the user exists in the database
			if(addedUserName.toLowerCase() == accountList[x].userName.toLowerCase()){
				userNameMatched = true;
				var userName = addedUserName.toLowerCase();
			}
		}
		if (userNameMatched == true){
			if (accountList[loggedInUsername].friends[userName] === undefined){ // checks that you haven't already added them
				accountList[userName].friendRequests[loggedInUsername] = loggedInUsername;
				localStorage.setItem("saveData", JSON.stringify(accountList));
				document.getElementById("txtUsername").value = "";
				alert("Friend request sent!")
			}
			else{
				alert("You've already added them");
				document.getElementById("txtUsername").value = "";
			}
		}
		else{
			alert("Username not found");
			document.getElementById("txtUsername").value = "";
		}
	}
	else{
		alert("You can't add yourself");
		document.getElementById("txtUsername").value = "";
	}
}

function addFriendElementsLoaded(){ // creates a div with the class "friend" and an id equivalent to the user's number of friends when they were added (1st friend = 1)
	var parentDiv = document.getElementById("contactsBox");
	for (addedUserName in accountList[loggedInUsername].friends){
		var newDiv = document.createElement("div");
		var newContent = document.createTextNode([addedUserName+" | "+accountList[addedUserName].firstName + " " + accountList[addedUserName].lastName]);
		newDiv.appendChild(newContent);
		newDiv.setAttribute("class", "friend");
		newDiv.setAttribute("onmousedown", `selectFriend('${addedUserName}')`); // gives the div onmousedown="selectFriend(addedUserName)"
		var friendQuantity = Object.keys(accountList[loggedInUsername].friends).length;
		newDiv.setAttribute("id", [friendQuantity]);
		if (friendQuantity > 1){ // checks if you only have 1 friend
			var currentDiv = document.getElementById([friendQuantity-1]);
			parentDiv.insertBefore(newDiv, currentDiv);
		}
		else{ // if you only have 1 friend, then it inserts the div below the submit user button in the body
			var currentDiv = document.getElementById("insertFriendBefore");
			parentDiv.insertBefore(newDiv, currentDiv);
		} // I realised that I could've just done appendChild after writing this
	}
}

function sendMessage(){
	var messageData = document.getElementById("txtMessage").value;
	var currentdate = new Date();
	if (messageData != ""){ // ensures the message data isn't just blank
		if (selectedUser != undefined){ // ensures that a contact is selected
			messageNumber = Object.keys(accountList[loggedInUsername].friends[selectedUser].messages).length+1; // the ordered value of the message (e.g. 3rd message in the chat = 3)
			accountList[loggedInUsername].friends[selectedUser].messages[messageNumber] = {
				sent: "out", // in/out - sending/receiving
				date: currentdate, // records the computer clock's date and time
				data: messageData,
				user: selectedUser // the other user in the conversation
			}
			accountList[selectedUser].friends[loggedInUsername].messages[messageNumber] = { // records it in the receiver's account data
				sent: "in",
				date: currentdate,
				data: messageData,
				user: loggedInUsername
			}
		}
		document.getElementById("txtMessage").value = "";
		messageData = ""
		localStorage.setItem("saveData", JSON.stringify(accountList));
		addMessageElement(messageNumber);
	}
}

function addMessageElement(messageNumber){
	var messageObject = accountList[loggedInUsername].friends[selectedUser].messages[messageNumber];
	var newDiv = document.createElement("div");
	newDiv.setAttribute("class", "container msg");
	var loggedInUserMessage = false;
	if (messageObject.sent == "out"){ //sets sent messages to have the "darker" class affected by css styling
		var loggedInUserMessage = true; // the message is being sent by the logged in user
	}
	var newContent = document.createElement("img");
	newContent.setAttribute("alt", "Avatar");
	newContent.setAttribute("class", "profilePicture");
	if (loggedInUserMessage){
		newDiv.setAttribute("class", "container darker msg");
		if (accountList[loggedInUsername].profilePicture == "pic1.png"){
			newContent.setAttribute("src", "../images/pic1.png");
		}
		else{
			dataImage = localStorage.getItem([loggedInUsername+accountList[loggedInUsername].profilePicture]);
			newContent.setAttribute("src", "data:image/png;base64,"+dataImage);
		}
		newContent.setAttribute("class", "right");
	}
	else{
		if (accountList[messageObject.user].profilePicture == "pic1.png"){
			newContent.setAttribute("src", "../images/pic1.png");
		}
		else{
			dataImage = localStorage.getItem([messageObject.user+accountList[messageObject.user].profilePicture]);
			newContent.setAttribute("src", "data:image/png;base64,"+dataImage);
		}
	}
	newDiv.appendChild(newContent);
	newContent = document.createElement("p");
	var newContent2 = document.createTextNode(messageObject.data);
	newContent.appendChild(newContent2);
	newDiv.appendChild(newContent);
	newContent = document.createElement("span");
	if (loggedInUserMessage){
		newContent.setAttribute("class", "time-left");
	}
	else{
		newContent.setAttribute("class", "time-right");
	}
	newContent2 = document.createTextNode(calcMsgTime(messageObject));
	newContent.appendChild(newContent2);
	newDiv.appendChild(newContent);
	var parentDiv = document.getElementById("messagesBox");
	parentDiv.appendChild(newDiv);
	var objDiv = document.getElementById("messagesBox");
	objDiv.scrollTop = objDiv.scrollHeight;
}

function calcMsgTime(object){ //calculates what time to display on messages (>7 days date)
	var currentdate = new Date();
	var messageDate = new Date(object.date);
	if (currentdate - object.date > 604800000){ // week in milliseconds
		return messageDate.toLocaleDateString(); // returns a date
	}
	else{
		var j = new Array("Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday");
		return (j[messageDate.getDay()]) + " " + messageDate.toLocaleTimeString('en-GB', { hour: "numeric", minute: "numeric"}); // returns a day & time
	}
}

function addMessageElementsLoaded(){
	if (selectedUser !== undefined){ // code only runs if there is a selected user
		if (accountList[loggedInUsername].friends[selectedUser] != undefined){
			for (messageNumber in accountList[loggedInUsername].friends[selectedUser].messages){
				var messageObject = accountList[loggedInUsername].friends[selectedUser].messages[messageNumber];
				var newDiv = document.createElement("div");
				newDiv.setAttribute("class", "container msg");
				var loggedInUserMessage = false;
				if (messageObject.sent == "out"){ //sets sent messages to have the "darker" class affected by css styling
					var loggedInUserMessage = true; // the message is being sent by the logged in user
				}
				var newContent = document.createElement("img");
				newContent.setAttribute("alt", "Avatar");
				newContent.setAttribute("class", "profilePicture");
				if (loggedInUserMessage){
					newDiv.setAttribute("class", "container darker msg");
					if (accountList[loggedInUsername].profilePicture == "pic1.png"){
						newContent.setAttribute("src", "../images/pic1.png"); //default image
					}
					else{
						dataImage = localStorage.getItem([loggedInUsername+accountList[loggedInUsername].profilePicture]);
						newContent.setAttribute("src", "data:image/png;base64,"+dataImage);
					}
					newContent.setAttribute("class", "right");
				}
				else{
					if (accountList[messageObject.user].profilePicture == "pic1.png"){
						newContent.setAttribute("src", "../images/pic1.png");
					}
					else{
						dataImage = localStorage.getItem([messageObject.user+accountList[messageObject.user].profilePicture]);
						newContent.setAttribute("src", "data:image/png;base64,"+dataImage);
					}
				}
				newDiv.appendChild(newContent);
				newContent = document.createElement("p");
				var newContent2 = document.createTextNode(messageObject.data);
				newContent.appendChild(newContent2);
				newDiv.appendChild(newContent);
				newContent = document.createElement("span");
				if (loggedInUserMessage){
					newContent.setAttribute("class", "time-left");
				}
				else{
					newContent.setAttribute("class", "time-right");
				}
				newContent2 = document.createTextNode(calcMsgTime(messageObject));
				newContent.appendChild(newContent2);
				newDiv.appendChild(newContent);
				var parentDiv = document.getElementById("messagesBox");
				parentDiv.appendChild(newDiv);
			}
		}
		var objDiv = document.getElementById("messagesBox");
		objDiv.scrollTop = objDiv.scrollHeight;
	}
}

function selectFriend(userName){ //username is the userName of the selected user
	document.getElementById("msgSendButton").disabled = false;
	if(selectedUser != userName){ // function only runs if the selected user is not currently selected
		selectedUser = userName;
		localStorage.setItem("selectedUserData", selectedUser);
		removeElementsByClass("msg")
		addMessageElementsLoaded();
	}
	document.getElementById("selectedUserNameMessages").innerHTML = [accountList[selectedUser].firstName] + " " + [accountList[selectedUser].lastName];
}

function removeElementsByClass(className){ // removes all elements with a certain class name - from stackoverflow
    var elements = document.getElementsByClassName(className);
    while(elements.length > 0){
        elements[0].parentNode.removeChild(elements[0]);
    }
}

function createAccounts(){ //for testing purposes
	accountList = {
		lemmy57: {
			firstName: "Matej",
			lastName: "Kondrot",
			userName: "lemmy57",
			email: "kondrot@yahoo.com",
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
			userName: "CoolioDJ",
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
			userName: "Ville",
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