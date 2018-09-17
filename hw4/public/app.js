/*
 * Frontend logic for the application
 *
 */

// Container for the frontend application
var app = {};

// Config
app.config = {
	'sessionToken': false
};

// AJAX Client (for the restfull API)
app.client = {};

// Interface for making API calls
app.client.request = function(headers, path, method, queryStringObject, payload, callback) {
	// Set defaults
	headers = typeof(headers) == 'object' && headers !== null ? headers : {};
	path = typeof(path) == 'string' ? path : '/';
	method = typeof(method) == 'string' && 
			 ['POST', 'GET', 'PUT', 'DELETE'].indexOf(method.toUpperCase()) > -1 ?
			 method.toUpperCase() : 'GET';
	queryStringObject = typeof(queryStringObject) == 'object' && queryStringObject !== null ? queryStringObject : {};
	payload = typeof(payload) == 'object' && payload !== null ? payload : {};
	callback = typeof(callback) == 'function' ? callback : false;

	// For each query string parameter sent, add it to the path
	var requestUrl = path + '?';
	var counter = 0;
	for (var queryKey in queryStringObject) {
		if (queryStringObject.hasOwnProperty(queryKey)) {
			counter++;
			// If at least 1 query string parameter has been added, prepend the next one with '&'
			if (counter > 1) {
				requestUrl += '&';
			} 
			// Add the key value
			requestUrl += queryKey + '=' + queryStringObject[queryKey];
		}
	}

	// Form the http request as a JSON type
	var xhr = new XMLHttpRequest();
	xhr.open(method, requestUrl, true);
	xhr.setRequestHeader('Content-Type', 'application/json');

	// For each header sent, add it to the request
	for (var headerKey in headers) {
		if (headers.hasOwnProperty(headerKey)) {
			xhr.setRequestHeader(headerKey, headers[headerKey]);
		}
	}

	// Add the session token to the headers if it exists
	if (app.config.sessionToken) {
		xhr.setRequestHeader('token', app.config.sessionToken.id);
	}

	// When the request comes back, handle the response
	xhr.onreadystatechange = function() {
		if (xhr.readyState == XMLHttpRequest.DONE) {
			var statusCode = xhr.status;
			var responseReturned = xhr.responseText;

			// Callback if requested
			if (callback) {
				try {
					var parsedResponse = JSON.parse(responseReturned);
					callback(statusCode, parsedResponse); 
				} catch(e) {
					callback(statusCode, false);
				}
			}
		}
	}

	// Send the payload as JSON
	var payloadString = JSON.stringify(payload);
	xhr.send(payloadString);
};

// Bind the logout button
app.bindLogoutButton = function() {
  	document.getElementById("logoutButton").addEventListener("click", function(e) {

    	// Stop it from redirecting anywhere
    	e.preventDefault();

    	// Log the user out
    	app.logUserOut();

  	});
};

// Log the user out then redirect them
app.logUserOut = function(redirectUser) {
	// Set redirectUser default to true
	var redirectUser = typeof(redirectUser) == 'boolean' ? redirectUser : true;

  	// Get the current token id
  	var tokenId = typeof(app.config.sessionToken.id) == 'string' ? app.config.sessionToken.id : false;

  	// Send the current token to the tokens endpoint to delete it
  	var queryStringObject = {
     	'id': tokenId
  	};
  	app.client.request(undefined,'api/tokens', 'DELETE', queryStringObject, undefined, function(statusCode, responsePayload) {
    	// Set the app.config token as false
    	app.setSessionToken(false);

    	// Send the user to the logged out page
    	if (redirectUser) {
    		window.location = 'session/deleted';
    	}
	});
};

// Bind the forms
app.bindForms = function() {
	if (document.querySelector('form')) {

		var allForms = document.querySelectorAll('form');
		for (var i = 0; i < allForms.length; i++) {

			allForms[i].addEventListener('submit', function(e) {

				// Stop it from submitting
				e.preventDefault();
				var formId = this.id;
				var path = this.action;
				var method = this.method.toUpperCase();

				// Hide the error message if it is shown due to previous errors
				document.querySelector('#' + formId + ' .formError').style.display = 'hidden';

				// Turn the inputs into a payload
				var payload = {};
				var elements = this.elements;
				for (var i = 0; i < elements.length; i++) {
					if (elements[i].type !== 'submit') {
						var valueOfElement = elements[i].type == 'checkbox' ? elements[i].checked : elements[i].value;
						if (elements[i].name == '_method') {
							method = valueOfElement;
						} else {
							payload[elements[i].name] = valueOfElement;
						}
					}
				}

				// If the method is DELETE, the payload should be a queryStringObject instead
        		var queryStringObject = method == 'DELETE' ? payload : {};

				// Call the API
				app.client.request(undefined, path, method, queryStringObject, payload, function(statusCode, responsePayload) {
					// Display an error on the form if needed
					if (statusCode !== 200) {
						if (statusCode == 403) {
							// Log the user out
							app.logUserOut();
						} else {
							// Try to get error from API or set the default error message
							var error = typeof(responsePayload.Error) == 'string' ? responsePayload.Error : 'An error has occured';

							// Set the formError field with the error text
							document.querySelector('#' + formId + ' .formError').innerHTML = error;

							// Show (unhide) the form field on the form
							document.querySelector('#' + formId + ' .formError').style.display = 'block';
						}
					} else {
						// If successful, send to form response processor
		        		app.formResponseProcessor(formId, payload, responsePayload);
					}
				});
			});
		}		
	}
};

// Form response processor
app.formResponseProcessor = function(formId, requestPayload, responsePayload) {
	var functionToCall = false;

	// If account creation was successful, try to immediately log the user in
	if (formId == 'accountCreate') {
		// Take the phone and password, and use it to log the user in
		var newPayload = {
			'phone': requestPayload.phone,
			'password': requestPayload.password
		};

		app.client.request(undefined, 'api/tokens', 'POST', undefined, newPayload, function(newResponseCode, newResponsePayload) {
			// Display an error on the form if needed
			if (newResponseCode !== 200) {
				// Try to get error from API or set the default error message
				var error = typeof(newResponsePayload.Error) == 'string' ? newResponsePayload.Error : 'An error has occured';

				// Set the formError field with the error text
				document.querySelector('#' + formId + ' .formError').innerHTML = error;

				// Show (unhide) the form field on the form
				document.querySelector('#' + formId + ' .formError').style.display = 'block';
			} else {
				// If successful, set the token and redirect the user
        		app.setSessionToken(newResponsePayload);
        		window.location = 'menu';
			}
		});
	}

	// If login was successful, set the token in localstorage and redirect the user
	if (formId == 'sessionCreate') {
		app.setSessionToken(responsePayload);
		window.location = 'menu';
	}

	// If forms saved successfully and they have success messages, show them
	var formsWithSuccessMessages = ['accountEdit1', 'accountEdit2'];
	if (formsWithSuccessMessages.indexOf(formId) > -1) {
		document.querySelector('#' + formId + ' .formSuccess').style.display = 'block';
	}

	// If the user just deleted their account redirect them to accountDeleted page
	if (formId == 'accountEdit3') {
		app.logUserOut(false);
		window.location = 'account/deleted';
	}

	if (formId == 'orderCreate') {
		window.location = 'thanks?token=' + app.config.sessionToken.id;
	}
};

// Get the session token from localstorage and set it in the app.config object
app.getSessionToken = function() {
	var tokenString = localStorage.getItem('token');
	if(typeof(tokenString) == 'string') {
	    try {
	      	var token = JSON.parse(tokenString);
		    app.config.sessionToken = token;
		    if(typeof(token) == 'object') {
		    	app.setLoggedInClass(true);
		    } else {
		        app.setLoggedInClass(false);
		    }
	    } catch(e) {
	        app.config.sessionToken = false;
	        app.setLoggedInClass(false);
	    }
	}
};

// Set (or remove) the loggedIn class from the body
app.setLoggedInClass = function(add)	{
  	var target = document.querySelector("body");
  	if(add)	{
    	target.classList.add('loggedIn');
  	} else {
    	target.classList.remove('loggedIn');
  	}
};

// Set the session token in the app.config object as well as localstorage
app.setSessionToken = function(token) {
	app.config.sessionToken = token;
	var tokenString = JSON.stringify(token);
	localStorage.setItem('token',tokenString);
	if(typeof(token) == 'object') {
    	app.setLoggedInClass(true);
  	} else {
    	app.setLoggedInClass(false);
  	}
};

// Renew the token
app.renewToken = function(callback)	{
  	var currentToken = typeof(app.config.sessionToken) == 'object' ? app.config.sessionToken : false;
  	if(currentToken){
	    // Update the token with a new expiration
	    var payload = {
	      	'id': currentToken.id,
	      	'extend': true,
	    };
	    app.client.request(undefined, 'api/tokens', 'PUT', undefined, payload, function(statusCode, responsePayload) {
	    	// Display an error on the form if needed
	    	if(statusCode == 200){
	        	// Get the new token details
	        	var queryStringObject = {'id' : currentToken.id};
	        	app.client.request(undefined, 'api/tokens', 'GET', queryStringObject, undefined, function(statusCode, responsePayload) {
	          		// Display an error on the form if needed
	          		if(statusCode == 200) {
	            		app.setSessionToken(responsePayload);
	            		callback(false);
	          		} else {
	            		app.setSessionToken(false);
	            		callback(true);
	          		}
	        	});
	      	} else {
	        	app.setSessionToken(false);
	        	callback(true);
	      	}
	    });
  	} else {
    	app.setSessionToken(false);
    	callback(true);
  	}
};

// Load data on the page
app.loadDataOnPage = function() {
  	// Get the current page from the body class
  	var bodyClasses = document.querySelector('body').classList;
  	var primaryClass = typeof(bodyClasses[0]) == 'string' ? bodyClasses[0] : false;

  	// Logic for account settings page
  	if (primaryClass == 'accountEdit') {
    	app.loadAccountEditPage();
  	}

  	// Logic for the menu page
  	if (primaryClass == 'menuPage') {
  		app.loadMenuPage();
  	}

  	// Logic for the order page
  	if (primaryClass == 'orderPage') {
  		app.loadOrderPage();
  	}
};

// Load the account edit page specifically
app.loadAccountEditPage = function() {
  	// Get the phone number from the current token, or log the user out if none is there
  	var phone = typeof(app.config.sessionToken.phone) == 'string' ? app.config.sessionToken.phone : false;
  	if(phone) {
    	// Fetch the user data
    	var queryStringObject = {
      		'phone' : phone
    	};
    	app.client.request(undefined, 'api/users', 'GET', queryStringObject, undefined, function(statusCode, responsePayload) {
	      	if(statusCode == 200) {
	        	// Put the data into the forms as values where needed
	         	document.querySelector("#accountEdit1 .firstNameInput").value = responsePayload.firstName;
	        	document.querySelector("#accountEdit1 .lastNameInput").value = responsePayload.lastName;
	        	document.querySelector("#accountEdit1 .addressInput").value = responsePayload.address;
	        	document.querySelector("#accountEdit1 .emailInput").value = responsePayload.email;
	        	document.querySelector("#accountEdit1 .displayPhoneInput").value = responsePayload.phone;

	        	// Put the hidden phone field into both forms
	        	var hiddenPhoneInputs = document.querySelectorAll("input.hiddenPhoneNumberInput");
	    		for(var i = 0; i < hiddenPhoneInputs.length; i++) {
	        		hiddenPhoneInputs[i].value = responsePayload.phone;
	    		}

	      	} else {
	        	// If the request comes back as something other than 200, log the user out (on the assumption that the api is temporarily down or the users token is bad)
	        	app.logUserOut();
	      	}
    	});
  	} else {
    	app.logUserOut();
  	}
};

// Load the menu page
app.loadMenuPage = function() {

	// Bind add and remove buttons in the menu table
	var bindAddItemBtn = function(buttons) {
		for (var i = 0; i < buttons.length; i++) {
			buttons[i].addEventListener('click', function(e) {
				// Stop it from redirecting anywhere
	    		e.preventDefault();
	    		// Add or remove item in the cart if clicked
	    		var itemId = this.id;
	    		var remove = this.className.indexOf('remove') > -1 ? true : false;
	    		addItemToCart(itemId, remove);
			});
		}
	};

	// Add or remove item to/from the cart
	var addItemToCart = function(itemId, remove) {
		// Increase or decrease quontity and add items to the cart
		var quantitySpan = document.querySelector('span.quantity#' + itemId);
		var quantity = quantitySpan.innerHTML;
		quantity = !remove ? ++quantity : quantity <= 0 ? 0 : --quantity;
		quantitySpan.innerHTML = quantity;

		var item = quantitySpan.getAttribute('value');
		var payload = {};
		payload[item] = quantity;

		app.client.request(undefined, 'api/carts', 'PUT', undefined, payload, function(statusCode, responsePayload){
			if (statusCode != 200) {
				app.logUserOut();
			}
		});
	};

	// Populate menu table with data
	var populateMenuTable = function(menuTable, menuTableColumns, menuData) {
		Object.keys(menuData).forEach(function(item) {
  			var tr = menuTable.insertRow(-1);
  			var td = [];
  			for (var i = 0; i < menuTableColumns; i++) { td[i] = tr.insertCell(i); }
  			td[0].innerHTML = menuData[item].type.toUpperCase();
  			td[1].innerHTML = item;
  			td[2].innerHTML = new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD'}).format(menuData[item].price);
  			if (phone) {
  				td[3].innerHTML = '<a class="cta red remove" id="' + item.toLowerCase().replace(' ', '_') + '" href="#">–</a>' +
							  	  '<span class="quantity" id="' + item.toLowerCase().replace(' ', '_') + '" value="' + item + '">0</span>' +
		     				      '<a class="cta green add" id="' + item.toLowerCase().replace(' ', '_') + '" href="#">+</a>';
		     	// Bind 'add to cart' and 'remove from cart' buttons
			    bindAddItemBtn(td[3].querySelectorAll('a'));
		    }
  		});
  		// Update quantities in the cart
  		if (phone) {
  			updateMenuTableQuantyties();
  		}
	};

	// Update quantities in the cart
	var updateMenuTableQuantyties = function() {
		app.client.request(undefined, 'api/carts', 'GET', undefined, undefined, function(statusCode, responsePayload) {
			var spansQuantity = document.querySelectorAll('span.quantity');
			if (statusCode == 200) {
				for (var i = 0; i < spansQuantity.length; i++) {
					var item = spansQuantity[i].getAttribute('value');
					var quantity = Object.keys(responsePayload).indexOf(item) > -1 ? responsePayload[item].quantity : 0;
					spansQuantity[i].innerHTML = quantity;
				}
			} else {
				// Create an empty cart
				app.client.request(undefined, 'api/carts', 'POST', undefined, {}, function(statusCode, responsePayload) {
					if (statusCode == 200) {
						for (var i = 0; i < spansQuantity.length; i++) {
							var item = spansQuantity[i].getAttribute('value');
							var quantity = Object.keys(responsePayload).indexOf(item) > -1 ? responsePayload[item].quantity : 0;
							spansQuantity[i].innerHTML = quantity;
						}
					} else {
						app.logUserOut();
					}
				});
			}
		});
	};
	
  	// Get the phone number from the current token, or log the user out if none is there
  	var phone = typeof(app.config.sessionToken.phone) == 'string' ? app.config.sessionToken.phone : false;
	
  	// Display the menu on the page
	app.client.request(undefined, 'api/menu', 'GET', undefined, undefined, function(statusCode, responsePayload) {
      	if (statusCode == 200) {
      		var menuData = responsePayload;
      		var menuTable = document.querySelector('table#menu');

      		// Remove login invitation
      		if (phone) {
      			document.querySelector('#loginInvitation').remove();
      		}

      		// Add table header and populate menu table with data
      		var menuTableHeaders = '<th>Type</th><th>Name</th><th>Price</th>';
      		var menuTableColumns = 3;
      		if (phone) {
      			menuTableHeaders += '<th>Add to Cart</th>';
      			menuTableColumns += 1;
      		}
      		menuTable.insertRow(0).innerHTML = menuTableHeaders;
      		populateMenuTable(menuTable, menuTableColumns, menuData);

      		// Bind the deleteCart button
      		if (phone) {
	      		document.querySelector('#deleteCart').addEventListener('click', function(e) {
	      			e.preventDefault();
	      			app.client.request(undefined, 'api/carts', 'DELETE', undefined, undefined, function(statusCode, responsePayload) {
	      				if (statusCode == 200) {
	      					updateMenuTableQuantyties();
	      				} else {
	      					app.logUserOut();
	      				}
	      			});
	      		});
      		} else {
      			// Remove order button after the menuTable
      			document.querySelector('#deleteCart').remove();
      			document.querySelector('#createOrder').remove();
      		}

      	} else {
        	// If the request comes back as something other than 200, log the user out (on the assumption that the api is temporarily down or the users token is bad)
        	app.logUserOut();
      	}
	});
};

// Load the order page
app.loadOrderPage = function() {	

	// Change mouse pointer to 'wait', after 'checkout' button is clicked
  	document.querySelector('button#checkout').addEventListener('click', function(e) {
		document.body.style.cursor = 'wait';
		this.style.cursor = 'wait';
	});

  	// Load the cart items to the page
	app.client.request(undefined, 'api/carts', 'GET', undefined, undefined, function(statusCode, responsePayload) {
		if (statusCode == 200 || statusCode == 201) {
			var total = responsePayload.total;
			if (total > 0) {
				var orderTable = document.querySelector('table#order');
				console.log(orderTable);
				Object.keys(responsePayload).forEach(function(item) {
					if (item != 'total') {
						var tr = orderTable.insertRow(-1);
						var td0 = tr.insertCell(0);
						var td1 = tr.insertCell(1);
						td0.classList.add('item');
						td1.classList.add('price');
						td0.innerHTML = item;
						td1.innerHTML = responsePayload[item].quantity + ' × ' +
										new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD'}).format(responsePayload[item].price) + ' = ' +
										new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD'}).format(responsePayload[item].subtotal);
					}
				});
				// Add total to the table
				tr = orderTable.insertRow(-1);
				tr.insertCell(0);
				td = tr.insertCell(1)
				td.innerHTML = new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD'}).format(total);
				td.classList.add('total');
			} else {
				// Redirect back to the menu
				window.location = 'menu?error=Please,%20put%20something%20in%20the%20cart%20before%20creating%20the%20order';
			}
		} else {
			app.logUserOut();
		}
	});
};

// Loop to renew token often
app.tokenRenewalLoop = function() {
  	setInterval(function() {
    	app.renewToken(function(err) {
      		if(!err){
        		console.log('Token renewed successfully @ ' + Date.now());
      		}
    	});
  	},1000 * 60);
};

// Init (bootstrapping)
app.init = function() {
	// Bind all the form submissions
	app.bindForms();

	// Bind logout logout button
  	app.bindLogoutButton();

	// Get the token from localstorage
  	app.getSessionToken();

  	// Renew token
  	app.tokenRenewalLoop();

  	// Load data on page
  	app.loadDataOnPage();
};

// Call the init process after the window loads
window.onload = function() {
	app.init();
};








