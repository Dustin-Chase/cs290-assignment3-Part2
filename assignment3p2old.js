

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

function doSomething(url) {
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
	httpRequest.open("GET", url, true)
	httpRequest.send();
	httpRequest.onreadystatechange = alertContents; 
}

function alertContents() {
	if(httpRequest.readyState === 4) {
		if (httpRequest.status === 200) {
			//console.log(httpRequest.responseText);
			JSONObj = JSON.parse(httpRequest.responseText);
			for (var i in JSONObj) {
				var files_object = JSONObj[i].files;
				for (var j in files_object) {
					console.log(files_object[j].language);
				}
			}			
		} else {
			alert('There was a problem with the request.'); 
		}
	}
	generateGistList(JSONObj); 
}

/*
Commented out old version of function 
*

function generateGistList(JSONArray) {
	var descriptions = document.getElementById("gistDescriptions");
	var tbl = document.createElement("table");
	tbl.setAttribute("id", "searchResults");
	var tblbody = document.createElement("tbody"); 
	for (var obj in JSONArray) {
		var row = document.createElement("tr");
		var anchor = document.createElement("a");
		var cellLink = document.createElement("td");
		var cellButton = document.createElement("td");
		var button = document.createElement("button");
		var text = document.createTextNode("Add to Favorites");
		button.appendChild(text);
		button.setAttribute("name", JSONArray[obj].html_url);
		button.addEventListener("click", function() {
		addToFavorites(this.name); });
		cellButton.appendChild(button); 
		
		var descript = JSONArray[obj].description; 
		anchor.setAttribute("href", JSONArray[obj].html_url);
		if (descript === null || descript === "") {
			anchor.innerHTML = "No Description";
		}
		else {
			anchor.innerHTML = (descript); 
		}
		cellLink.appendChild(anchor); 
		row.appendChild(cellLink); 
		row.appendChild(cellButton); 
		tblbody.appendChild(row); 
	}

	tbl.appendChild(tblbody); 
	descriptions.appendChild(tbl);
	tbl.setAttribute("border", 2);
	tbl.insertRow();
}
*/
/*
* Dynamically generate a list of gist descriptions
* @ param: JSONArray: An array of JSON Gist Objects
* Output: A list of gist descriptions which link to the HTML
* version of the gist. 
*
*/
function generateGistList(JSONArray) {
	var descriptions = document.getElementById("gistDescriptions");
	var tbl = document.createElement("table");
	var row; 
	tbl.setAttribute("id", "searchResults");
	for (var obj in JSONArray) {
		row = document.createElement("tr");
		row.setAttribute("id", JSONArray[obj].html_url);
		var anchor = document.createElement("a");
		var cellLink = document.createElement("td");
		var cellButton = document.createElement("td");
		var button = document.createElement("button");
		var text = document.createTextNode("Add to Favorites");
		button.appendChild(text);
		button.setAttribute("name", JSONArray[obj].html_url);
		button.addEventListener("click", function() {
		addToFavorites(this.name); });
		cellButton.appendChild(button); 
		
		var descript = JSONArray[obj].description; 
		anchor.setAttribute("href", JSONArray[obj].html_url);
		if (descript === null || descript === "") {
			anchor.innerHTML = "No Description";
		}
		else {
			anchor.innerHTML = (descript); 
		}
		cellLink.appendChild(anchor); 
		row.appendChild(cellLink); 
		row.appendChild(cellButton); 
		tbl.appendChild(row); 
	}

	descriptions.appendChild(tbl);
	tbl.setAttribute("border", 2);
}
/*
* Add a JSON object to favorites
* Alerts if already in favorites, adds
* to local storage otherwise. 
* @ param {JSON} JSONObj
* @ param {String} key 
*/
function addToFavorites(key) {
		var nextJSON = getJSON(key);
		if (nextJSON != null) {
			alert("That item is already in your favorites.");
			return; 
		}
	var obj = getGist(key, JSONObj); 
	var index = indexOfGist(key, JSONObj);
	localStorage.setItem(key, JSON.stringify(obj));
	removeGist(key, JSONObj);
	var tble = document.getElementById("searchResults");
	var child = document.getElementById(key);
	tble.removeChild(child); 
	alert("Item added successfully!"); 
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
	localStorage.removeItem(key); 
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
