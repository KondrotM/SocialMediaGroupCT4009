var accountList = {};
var reportedPosts = [];
var loggedInUsername;
if (JSON.parse(localStorage.getItem("saveData")) !== null){ // if an account has already been registered, it loads the account list
	accountList = JSON.parse(localStorage.getItem("saveData"));
}
if (localStorage.getItem("loggedInData") !== null){ // checks if an account was previously logged in
	loggedInUsername = localStorage.getItem("loggedInData");
}
if (localStorage.getItem("reportedPostsData") !== null){ // loads reported posts
	reportedPosts = JSON.parse(localStorage.getItem("reportedPostsData"));
}
window.onload = function () { // ensures that the html loads before the javascript
	createPostWallElements(); 
	//createPostWallElements(); 
	//createPostWallElements(); 
	//createPostCommentElements();
};

function logout(){
	localStorage.removeItem("selectedUserData"); //removes the log in data
	localStorage.removeItem("loggedInData"); //removes the log in data
    $.ajax({
        type: "POST",
        url: "postDAO.php",
        data: "phpfunction=logout",
    })
	window.location.replace("../loginPage/login.html");
}
function postWall(){
	var postData = document.getElementById("txtMessage").value;
	if (postData != ""){
		var postImage = document.getElementById("imgPpf").value.split(/(\\|\/)/g).pop(); //file name and format
		var currentdate = new Date();
		var postQuantity = Object.keys(accountList[loggedInUsername].posts).length;
		accountList[loggedInUsername].posts[postQuantity+1] = {
			data: postData,
			image: postImage,
			date: currentdate,
			username: loggedInUsername,
			comments: {}
		}
		if(accountList[loggedInUsername].posts[postQuantity+1].postImage != ""){ // if there is an image
			var imgData = getBase64Image(displayedUploadedImg);
			localStorage.setItem([loggedInUsername+accountList[loggedInUsername].posts[postQuantity+1].image], imgData); //F details.profilePicture is a string equal to the username and the name/format of the saved file, e.g. lemmy57dog.png
		}
		localStorage.setItem("saveData", JSON.stringify(accountList));
		createPostWallElements();
		document.getElementById("txtMessage").value = "";
		postData = document.getElementById("txtMessage").value;
		location.reload();
	}
}

function createPostWallElements(){
    $.ajax({
        type: "POST",
        url: "postDAO.php",
        data: "phpfunction=getVisiblePosts",
        dataType: 'json',
        success: 
        function(echoedMsg){
            var posts = echoedMsg;
            console.log('Something went right? ', posts);
            removeElementsByClass("post");
            var parentDiv = document.getElementById("postWallBox");
            for (x in posts){
                var newDiv = document.createElement("div");
                newDiv.setAttribute("class", "post");
                console.log("X SHOULD BE HERE -> ",x);
                newDiv.setAttribute("id", `'${posts[x][1]}'+'${posts[x][4]}'`);
                var newContent = document.createElement("div");
                newContent.setAttribute("class", "container");
                if (posts[x][3] != ""){ //if an image has been uploaded
                    var newContent2 = document.createElement("div");
                    newContent2.setAttribute("class", "postImageBox");
                    var newContent3 = document.createElement("img");
                    newContent3.setAttribute("alt", "image")
//                    dataImage = localStorage.getItem([newestPost.username+newestPost.image]);
                    newContent3.setAttribute("src", posts[x][3]);
                    newContent2.appendChild(newContent3);
                    newContent.appendChild(newContent2);
                }
                var newContent2 = document.createElement("div");
                newContent2.setAttribute("class", "user");
//                var newContent3 = document.createTextNode(accountList[newestPost.username].firstName + " " + accountList[newestPost.username].lastName + " | " + newestPost.username);
                var newContent3 = document.createTextNode(posts[x][1]);
                newContent2.appendChild(newContent3);
                newContent.appendChild(newContent2);
                newContent2 = document.createElement("p");
                newContent3 = document.createTextNode(posts[x][2]);
                newContent2.appendChild(newContent3);
                newContent.appendChild(newContent2);
                newContent2 = document.createElement("div");
                newContent2.setAttribute("class", "time-right");
                newContent3 = document.createTextNode([new Date(posts[x][4])].toLocaleString()); // from JSON string to date object to string
                newContent2.appendChild(newContent3);
                newContent3 = document.createElement("br");
                newContent2.appendChild(newContent3);
                newContent3 = document.createElement("button");
                var newContent4 = document.createTextNode("Report Post");
                newContent3.appendChild(newContent4);
                newContent3.setAttribute("onmousedown", `reportPost('${posts[x][1]}', '${posts[x][4]}')`)
                newContent2.appendChild(newContent3);
                newContent.appendChild(newContent2);
                newDiv.appendChild(newContent);
                newContent = document.createElement("div");
                newContent.setAttribute("class", "commentbox");
                newContent2 = document.createElement("textarea");
                newContent2.setAttribute("type", "text");
                newContent2.setAttribute("id", ["txtComment"+posts[x][1]+posts[x][4]]); // the id of the textarea will be a very long string consisting of "textComment", followed by the username, followed by the computer clock date/time (as a string)
                newContent2.setAttribute("name", "comment");
                newContent2.setAttribute("required", "required");
                newContent.appendChild(newContent2);
                newContent2 = document.createElement("button");
                newContent2.setAttribute("class", "button");
                newContent2.setAttribute("onmousedown", `postComment('${posts[x][1]}', '${posts[x][4]}')`);
                newContent3 = document.createTextNode("Post Comment");
                newContent2.appendChild(newContent3);
                newContent.appendChild(newContent2);
                newDiv.appendChild(newContent);
                parentDiv.insertBefore(newDiv, insertPostBefore);                
            }
        },
        error: function(msg){
            console.log(msg);
        }
         
                         
                
    });
    
//    request.done(function(msg){
//        console.log(msg);
//        console.log("anything");
//    });
//    
//    
    
//    console.log(items);
    
   /* 
	removeElementsByClass("post");
	var parentDiv = document.getElementById("postWallBox");
	var visiblePostUsers = Object.keys(accountList[loggedInUsername].friends);
	visiblePostUsers.push(loggedInUsername);
	var unorderedPostsArray = [];
	for (userName of visiblePostUsers){
		for (i=1; i<Object.keys(accountList[userName].posts).length+1;i++){
			unorderedPostsArray.push(accountList[userName].posts[i]);
		}
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
		newContent2 = document.createElement("div");
		newContent2.setAttribute("class", "time-right");
		newContent3 = document.createTextNode([new Date(newestPostDate)].toLocaleString()); // from JSON string to date object to string
		newContent2.appendChild(newContent3);
		newContent3 = document.createElement("br");
		newContent2.appendChild(newContent3);
		newContent3 = document.createElement("button");
		var newContent4 = document.createTextNode("Report Post");
		newContent3.appendChild(newContent4);
		newContent3.setAttribute("onmousedown", `reportPost('${newestPost.username}', '${newestPost.date}')`)
		newContent2.appendChild(newContent3);
		newContent.appendChild(newContent2);
		newDiv.appendChild(newContent);
		newContent = document.createElement("div");
		newContent.setAttribute("class", "commentbox");
		newContent2 = document.createElement("textarea");
		newContent2.setAttribute("type", "text");
		newContent2.setAttribute("id", ["txtComment"+newestPost.username+newestPost.date]); // the id of the textarea will be a very long string consisting of "textComment", followed by the username, followed by the computer clock date/time (as a string)
		newContent2.setAttribute("name", "comment");
		newContent2.setAttribute("required", "required");
		newContent.appendChild(newContent2);
		newContent2 = document.createElement("button");
		newContent2.setAttribute("class", "button");
		newContent2.setAttribute("onmousedown", `postComment('${newestPost.username}', '${newestPost.date}')`);
		newContent3 = document.createTextNode("Post Comment");
		newContent2.appendChild(newContent3);
		newContent.appendChild(newContent2);
		newDiv.appendChild(newContent);
		parentDiv.insertBefore(newDiv, insertPostBefore);
	} */
}

function postComment(username, date){ //initializes the variable data for the comment
	for (x in accountList[username].posts){
		if (accountList[username].posts[x].date == date){ // finds the post that you're commenting on
			var postCommentData = document.getElementById(["txtComment"+username+date]).value;
			if (postCommentData != ""){
				var postCommentQuantity = Object.keys(accountList[username].posts[x].comments).length;
				accountList[username].posts[x].comments[postCommentQuantity+1] = {
					username: loggedInUsername,
					data: postCommentData
				}
				document.getElementById(["txtComment"+username+date]).value = "";
				postCommentData = "";
				createPostCommentElements();
			}
		}
		localStorage.setItem("saveData", JSON.stringify(accountList));
	}
}

function createPostCommentElements(){ // creates the elements for the comments on the page
	var visiblePostUsers = Object.keys(accountList[loggedInUsername].friends);
	visiblePostUsers.push(loggedInUsername);
	var unorderedPostsArray = [];
	for (userName of visiblePostUsers){
		for (i=1; i<Object.keys(accountList[userName].posts).length+1;i++){
			unorderedPostsArray.push(accountList[userName].posts[i]);
		}
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
            console.log(newDiv);
			parentDiv.appendChild(newDiv);
		}
	}
}

function reportPost(userName, date){
	var alreadyReported = false;
	for (z of reportedPosts){
		if (z.username == userName && z.date == date){
			alreadyReported = true;
		}
	}
	if (alreadyReported == false){
		for (userPosts in accountList[userName].posts){
			if(accountList[userName].posts[userPosts].date == date){
				reportedPosts.push(accountList[userName].posts[userPosts]);
			}
		}
		alert("Post has been reported");
	}
	else{
		alert("Post has already been reported");
	}
	localStorage.setItem("reportedPostsData", JSON.stringify(reportedPosts));
}

function readURL(input){ // displays uploaded image - from stackoverflow
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
function removeElementsByClass(className){ // removes all elements with a certain class name - from stackoverflow
    var elements = document.getElementsByClassName(className);
    while(elements.length > 0){
        elements[0].parentNode.removeChild(elements[0]);
    }
}