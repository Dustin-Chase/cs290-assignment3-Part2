/*
This is the file assignment3p2.js
It accompanies assignment2p2.html
Author: Dustin Chase
E-mail: chased@onid.oregonstate.edu
Assignment: 3 part 2 Javascript and AJAX
Due Date: 2/1/15

This program searches the git website for git gists. It displays these
gists on a page and allows the user to save some of them for later viewing. 
*/

/*
Function call when window loads or is refreshed. 
This function checks local storage for any favorites 
and displays them.
*/
window.onload = function () {
	//load and display local storage
	var favoritesDiv = document.getElementById("favoritesList"); 
	var faves = localStorage.getItem("favorites");
	var data = JSON.parse(faves); 
	for(var i in data) {
		var key = data[i].html_url;
		
		//create new definition list to hold link and corresponding
		//"remove from favorites" button
		var newItem = document.createElement("dl");
		newItem.setAttribute("id", key);
		
		//create new define term to hold link
		var link = document.createElement("dt");
		
		//create new description term to hold the "save" button
		var button = document.createElement("dd");
		
		//create anchor to hold gist description/link
		var anchor = document.createElement("a");
		anchor.setAttribute("href", key);
		var descript = data[i].description; 
		if (descript === null || descript === "") {
			anchor.innerHTML = "No Description";
		}
		else {
			anchor.innerHTML = (descript); 
		}
		
		//create "save" button
		var saveButton = document.createElement("button");
		var text = document.createTextNode("Remove from Favorites");
		saveButton.appendChild(text);
		saveButton.setAttribute("name", key);
		saveButton.addEventListener("click", function() {
		removeFromFavorites(this.name); });
		button.appendChild(saveButton); 
		
		//append these items together into a single definition list
		button.appendChild(saveButton);
		link.appendChild(anchor);
		link.appendChild(button);
		newItem.appendChild(link);
		
		//append the new item to the favorites div
		favoritesDiv.appendChild(newItem);
	}
}

//create the http request used to query the gist webpage
function createHttpRequestObject() {
	var xmlHttp;

	/*Code Source: Mozilla.org - Getting Started with Ajax*/	
	if(window.ActiveXObject) {
		try {
			xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
		}
		catch(e) {
			xmlHttp = false;
		}			
	} 
	else {
		try {
			xmlHttp = new XMLHttpRequest(); 
		} catch(e) {
			xmlHttp = false; 
		}
	}
	
	if(!xmlHttp)
		alert("Could not create XML Request");
	else {
		return xmlHttp; 
	}
}

var httpRequest; //holds gist requests
var JSONObj; //holds httpRequest text parsed to JSON objects
var favorites = []; //array of user's favorites

//this function filters the JSON gist objects and removes those
//that do not match the user's requested languages. 
function filter(JSONObj) {
	var x, numResults, javaScript, Python, JSON, SQL;
	x = document.getElementById("form1");
	for (var i = 0; i < 5; i++ ) {
		if(x.elements[i].type == "checkbox")
				console.log(x.elements[i].value + " : " + x.elements[i].checked );
		else
			console.log( x.elements[i].name + " input was: " + x.elements[i].value);
	}
	for (var i in JSONObj) {
		var files_object = JSONObj[i].files;
			for (var j in files_object) {
					var lang = files_object[j].language;
					if ((x.elements[1].checked === true && lang != "JavaScript") ||
						(x.elements[2].checked === true && lang != "Python") ||
						 (x.elements[3].checked === true && lang != "JSON") ||
						 (x.elements[4].checked === true && lang != "SQL"))
						{
						JSONObj.splice(i, 1); 
					}
					else {
						//intentionally blank
					}
			}
	}			
	return JSONObj; 
}

//Create the AJAX request and send to server once ready
function search() {
	event.preventDefault();
	var x, numResults, javaScript, Python, JSON, SQL;
	x = document.getElementById("form1");
	for (var i = 0; i < 5; i++ ) {
		if(x.elements[i].type == "checkbox")
				console.log(x.elements[i].value + " : " + x.elements[i].checked );
		else
			console.log( x.elements[i].name + " input was: " + x.elements[i].value);
	}
	httpRequest = createHttpRequestObject(); 
	httpRequest.open("GET", "https://api.github.com/gists/public", true)
	httpRequest.send();
	httpRequest.onreadystatechange = alertContents; 
}

//calls two other functions which generate the search results
//table
function alertContents() {
	if(httpRequest.readyState === 4) {
		if (httpRequest.status === 200) {
			JSONObj = JSON.parse(httpRequest.responseText);
		} else {
			alert('There was a problem with the request.'); 
		}
	}
	JSONObj = filter(JSONObj);
	generateGistList(JSONObj); 
}


/*
* Dynamically generate a definition list of gist descriptions
* @ param: JSONArray: An array of JSON Gist Objects
* Output: A list of gist descriptions which link to the HTML
* version of the gist. 
*
*/
function generateGistList(JSONArray) {
	var descriptions = document.getElementById("searchResults");
	for (var obj in JSONArray) {
		var key = JSONArray[obj].html_url;
		
		//create new definition list to hold link and corresponding
		//"save to favorites" button
		var newItem = document.createElement("dl");
		newItem.setAttribute("id", key);
		
		//create new define term to hold link
		var link = document.createElement("dt");
		
		//create new description term to hold the "save" button
		var button = document.createElement("dd");
		
		//create anchor to hold gist description/link
		var anchor = document.createElement("a");
		anchor.setAttribute("href", JSONArray[obj].html_url);
		var descript = JSONArray[obj].description; 
		if (descript === null || descript === "") {
			anchor.innerHTML = "No Description";
		}
		else {
			anchor.innerHTML = (descript); 
		}
		
		//create "save" button
		var saveButton = document.createElement("button");
		var text = document.createTextNode("Add to Favorites");
		saveButton.appendChild(text);
		saveButton.setAttribute("name", JSONArray[obj].html_url);
		saveButton.addEventListener("click", function() {
		addToFavorites(document.getElementById(this.name)); });
		button.appendChild(saveButton); 
		
		//append these items together into a single definition list
		button.appendChild(saveButton);
		link.appendChild(anchor);
		link.appendChild(button);
		newItem.appendChild(link);
		
		//append the new item to the descriptions div
		descriptions.appendChild(newItem);
	}
}
/*
* Add a JSON object to favorites
* Alerts if already in favorites, adds
* to local storage otherwise. 
* @ param {String} JSONkey - key to the JSON 
*/
function addToFavorites(JSONKey) {
	
	removeFromSearchList(JSONKey);
	var temp = getGist(JSONKey.id, JSONObj); 
	//rebuild the node from the JSON object
	var favoritesDiv = document.getElementById("favoritesList");
	var key = JSONKey.id; 
		
		//create new definition list to hold link and corresponding
		//"remove from favorites" button
		var newItem = document.createElement("dl");
		newItem.setAttribute("id", key);
		
		//create new define term to hold link
		var link = document.createElement("dt");
		
		//create new description term to hold the "save" button
		var button = document.createElement("dd");
		
		//create anchor to hold gist description/link
		var anchor = document.createElement("a");
		anchor.setAttribute("href", key);
		var descript = temp.description; 
		if (descript === null || descript === "") {
			anchor.innerHTML = "No Description";
		}
		else {
			anchor.innerHTML = (descript); 
		}
		
		//create "save" button
		var saveButton = document.createElement("button");
		var text = document.createTextNode("Remove from Favorites");
		saveButton.appendChild(text);
		saveButton.setAttribute("name", key);
		saveButton.addEventListener("click", function() {
		removeFromFavorites(this.name); });
		button.appendChild(saveButton); 
		
		//append these items together into a single definition list
		button.appendChild(saveButton);
		link.appendChild(anchor);
		link.appendChild(button);
		newItem.appendChild(link);
		
		//append the new item to the favorites div
		favoritesDiv.appendChild(newItem);
	
	
	favorites.push(temp);
	localStorage.setItem("favorites", JSON.stringify(favorites));	
}

/*
* Remove the JSON object from search results display
* @ param {String} linkID - the unique identifier for the link list item
* @ param {String} buttonID - the unique identifier for the button list item 
*/
function removeFromSearchList(linkID) {
	var searchResults = document.getElementById("searchResults");
	searchResults.removeChild(linkID);
}

/*
* Add the JSON object to the favorites list display
* @ param (JSON) JSONObj - the object to list
*/
function addToFavoritesList(JSONObj) {
	var favoritesList = document.getElementById("favoritesList");
	favoritesList.appendChild(JSONObj);
	
}

/*
* Retrieve a JSON object from local storage
* @param {String} key - the html-url of gist
* Returns JSON object at key
*/
function getJSON(key) {
	return JSON.parse(localStorage.getItem(key));
}

/*
* Delete a JSON object from local storage
* @param (string) key - the html_url of gist
*/
function removeFromFavorites(key) {
	var faves = localStorage.getItem("favorites");
	faves = JSON.parse(faves);
	var index = 0; 
	while (faves[index].html_url != key && index < faves.length) {
			index++; 
	}
	if (index == faves.length)
		alert("That item not found in storage.");
	else
		faves.splice(index, 1);
	localStorage.setItem("favorites", JSON.stringify(faves));
	
	//remove from favorites listing on the web page
	var element = document.getElementById(key);
	var favoritesDiv = document.getElementById("favoritesList");
	favoritesDiv.removeChild(element); 
}

/*
* Determine if the key item is in an array of 
* JSON gists. 
* @param {String} key - the html_url of the object
* @param {array} JSONArray - an array of JSON objects
* returns true if key found in array, false otherwise
*/
function containsGist(key, JSONArray) {
	for (var i in JSONArray) {
		if (JSONArray[i].html_url === key) {
			return true; 
		}
	}	
	return false; 
}

/*
* Return the location of key in the JSON array 
* @param {String} key - the html_url of the object
* @param {array} JSONArray - an array of JSON objects
* returns index, or -1 if not found
*/
function indexOfGist(key, JSONArray) {
	for (var i in JSONArray) {
		if (JSONArray[i].html_url === key) {
			return i; 
		}
	}	
	return -1; 
}

/*
* Remove the key item from an array of 
* JSON gists. 
* @param {String} key - the html_url of the object
* @param {array} JSONArray - an array of JSON objects
*/
function removeGist(key, JSONArray) {
	for (var i in JSONArray) {
		if (JSONArray[i].html_url === key) {
			JSONArray.splice(i, 1); 
			break;
		}
	}	 
}

/*
* Return the key item from an array of 
* JSON gists. 
* @param {String} key - the html_url of the object
* @param {array} JSONArray - an array of JSON objects
* Assumes key is valid i.e. exists in JSONArray
* returns JSON object
*/
function getGist(key, JSONArray) {
	for (var i in JSONArray) {
		if (JSONArray[i].html_url === key) {
			return JSONArray[i]; 
		}
	}
}
