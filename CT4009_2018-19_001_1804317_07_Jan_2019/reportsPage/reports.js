var accountList = {};
var reportedPosts = [];
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
if (localStorage.getItem("reportedPostsData") !== null){ // loads reported posts
	reportedPosts = JSON.parse(localStorage.getItem("reportedPostsData"));
}
function logout(){
	localStorage.removeItem("loggedInData"); //removes the log in data
	localStorage.removeItem("selectedUserData"); //removes the log in data
	window.location.replace("../loginPage/login.html");
}
window.onload = function () { // ensures that the html loads before the javascript
	createPostWallElements();
	createPostCommentElements();
	if (loggedInUsername != "administrator"){ // prevents non-admin users from accessing this page
		logout();
	}
}
function createPostWallElements(){
	removeElementsByClass("post");
	var parentDiv = document.getElementById("postWallBox");
	var unorderedPostsArray = [];
	for (x of reportedPosts){
		unorderedPostsArray.push(x);
	}
	var originalPostArrayLength = unorderedPostsArray.length;
	for (x=0;x<originalPostArrayLength;x++){
		var newestPost = unorderedPostsArray[0];
		var newestPostZ = 0;
		var newestPostDate = new Date(newestPost.date) // converts from string to date
		for (z=0;z<unorderedPostsArray.length;z++){
			if (z < unorderedPostsArray.length-1){
				var nextPost = unorderedPostsArray[z+1];
				var nextPostDate = new Date(nextPost.date) // will cause an error if nextPost is undefined
			}
			if(z < unorderedPostsArray.length-1){
				if (newestPostDate - nextPostDate <= 0){
					newestPost = nextPost;
					newestPostZ = z+1;
					newestPostDate = new Date(newestPost.date)
				}
			}
			else{
				unorderedPostsArray.splice(newestPostZ, 1); //removes the newest post from the array
			}
		}
		var newDiv = document.createElement("div");
		newDiv.setAttribute("class", "post");
		newDiv.setAttribute("id", [newestPost.username+newestPost.date]);
		var newContent = document.createElement("div");
		newContent.setAttribute("class", "container");
		if (newestPost.image != ""){ //if an image has been uploaded
			var newContent2 = document.createElement("div");
			newContent2.setAttribute("class", "postImageBox");
			var newContent3 = document.createElement("img");
			newContent3.setAttribute("alt", "image")
			dataImage = localStorage.getItem([newestPost.username+newestPost.image]);
			newContent3.setAttribute("src", "data:image/png;base64,"+dataImage);
			newContent2.appendChild(newContent3);
			newContent.appendChild(newContent2);
		}
		var newContent2 = document.createElement("div");
		newContent2.setAttribute("class", "user");
		var newContent3 = document.createTextNode(accountList[newestPost.username].firstName + " " + accountList[newestPost.username].lastName + " | " + newestPost.username);
		newContent2.appendChild(newContent3);
		newContent.appendChild(newContent2);
		newContent2 = document.createElement("p");
		newContent3 = document.createTextNode(newestPost.data);
		newContent2.appendChild(newContent3);
		newContent.appendChild(newContent2);
		newContent2 = document.createElement("span");
		newContent2.setAttribute("class", "time-right");
		newContent3 = document.createElement("button");
		newContent4 = document.createTextNode("Ban User");
		newContent3.appendChild(newContent4);
		newContent3.setAttribute("onmousedown", `banUser('${newestPost.username}', '${newestPost.date}')`);
		newContent2.appendChild(newContent3);
		newContent3 = document.createElement("button");
		newContent4 = document.createTextNode("Dismiss Report");
		newContent3.appendChild(newContent4);
		newContent3.setAttribute("onmousedown", `dismissReport('${newestPost.username}', '${newestPost.date}')`);
		newContent2.appendChild(newContent3);
		newContent3 = document.createElement("br");
		newContent2.appendChild(newContent3);
		newContent3 = document.createTextNode([new Date(newestPostDate)].toLocaleString()); // from JSON string to date object to string
		newContent2.appendChild(newContent3);
		newContent.appendChild(newContent2);
		newDiv.appendChild(newContent);
		console.log(newDiv);
		parentDiv.insertBefore(newDiv, insertPostBefore);
	}
}
function createPostCommentElements(){ // creates the elements for the comments on the page
	var unorderedPostsArray = [];
	for (x of reportedPosts){
		unorderedPostsArray.push(x);
	}
	removeElementsByClass("comment");
	for (z=0;z<unorderedPostsArray.length;z++){ // array of all relevant posts
		var parentDiv = document.getElementById(unorderedPostsArray[z].username+unorderedPostsArray[z].date);
		var postCommentQuantity = Object.keys(unorderedPostsArray[z].comments).length;
		for (i=postCommentQuantity; i>0; i--){
			var newDiv = document.createElement("div");
			newDiv.setAttribute("class", "commentbox comment");
			var newContent = document.createElement("div");
			newContent.setAttribute("class", "user");
			var newContent2 = document.createTextNode(accountList[unorderedPostsArray[z].comments[i].username].firstName + " " + accountList[unorderedPostsArray[z].comments[i].username].lastName + " | " + unorderedPostsArray[z].comments[i].username);
			newContent.appendChild(newContent2);
			newDiv.appendChild(newContent);
			newContent = document.createElement("p");
			newContent2 = document.createTextNode(unorderedPostsArray[z].comments[i].data);
			newContent.appendChild(newContent2);
			newDiv.appendChild(newContent);
			parentDiv.appendChild(newDiv);
		}
	}
}

function banUser(userName, date){
	var banCheck = confirm("Are you sure you want to ban "+userName+"?"); // prompts the admin
	if (banCheck){ //if yes is clicked
		delete accountList[userName];
		bannedUsers.push(userName.toLocaleLowerCase()); //must be all lower case as string comparisons are case sensitive
		localStorage.setItem("bannedUsersData", bannedUsers);
		localStorage.setItem("saveData", JSON.stringify(accountList));
		alert("User banned");
		dismissReport(userName, date);
	}
}

function dismissReport(userName, date){
	for (z of reportedPosts){
		if (z.username == userName){
			if (z.date == date){
				var y = reportedPosts.indexOf(z); //gets the index number of the post
				reportedPosts.splice(y, 1); //dismisses the reported post
				localStorage.setItem("reportedPostsData", JSON.stringify(reportedPosts));
				location.reload();
			}
		}
	}
}
function removeElementsByClass(className){ // removes all elements with a certain class name - from stackoverflow
    var elements = document.getElementsByClassName(className);
    while(elements.length > 0){
        elements[0].parentNode.removeChild(elements[0]);
    }
}