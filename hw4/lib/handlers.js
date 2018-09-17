/*
 * Request handlers
 *
 */


// Dependencies
var _data = require('./data');
var helpers = require('./helpers');
var config = require('./config');

// Define the handlers
var handlers = {};

// Ping handler
handlers.ping = function(data, callback) {
	callback(200);
};


/*
 * HTML handlers
 *
 */

// Index handler
handlers.index = function(data, callback) {
	// Allow only GET requests
	if (data.method == "get") {
		// Prepare data for interpolation
		var templateData = {
			'head.title': 'Pizza Delivery',
			'head.description': 'Login or Signup to get the best pizza you\'ve ever tasted.',
			'body.class': 'index'
		};

		// Read in a template as a string
		helpers.getTemplate('index', templateData, function(err, str) {
			if (!err && str) {
				// Add the universal header and footer
				helpers.addUniversalTemplates(str, templateData, function(err, str) {
					if (!err && str) {
						// Return the page as HTML
						callback(200, str, 'html');

					} else {
						callback(500, undefined, 'html');
					}
				});
			} else {
				callback(500, undefined, 'html');
			}
		});
	} else {
		callback(405, undefined, 'html');
	}
};

// Create account
handlers.accountCreate = function(data, callback) {
	// Allow only GET requests
	if (data.method == "get") {
		// Prepare data for interpolation
		var templateData = {
			'head.title': 'Create an Accont',
			'head.description': 'Signup is easy and only takes few seconds.',
			'body.class': 'accountCreate'
		};

		// Read in a template as a string
		helpers.getTemplate('accountCreate', templateData, function(err, str) {
			if (!err && str) {
				// Add the universal header and footer
				helpers.addUniversalTemplates(str, templateData, function(err, str) {
					if (!err && str) {
						// Return the page as HTML
						callback(200, str, 'html');

					} else {
						callback(500, undefined, 'html');
					}
				});
			} else {
				callback(500, undefined, 'html');
			}
		});
	} else {
		callback(405, undefined, 'html');
	}
};

// Delete the session (logout)
handlers.sessionDeleted = function(data, callback) {
	// Allow only GET requests
	if (data.method == "get") {
		// Prepare data for interpolation
		var templateData = {
			'head.title': 'Logged Out',
			'head.description': 'You have been logged out of your account.',
			'body.class': 'sessionDeleted'
		};

		// Read in a template as a string
		helpers.getTemplate('sessionDeleted', templateData, function(err, str) {
			if (!err && str) {
				// Add the universal header and footer
				helpers.addUniversalTemplates(str, templateData, function(err, str) {
					if (!err && str) {
						// Return the page as HTML
						callback(200, str, 'html');

					} else {
						callback(500, undefined, 'html');
					}
				});
			} else {
				callback(500, undefined, 'html');
			}
		});
	} else {
		callback(405, undefined, 'html');
	}
};

// Edit the account
handlers.accountEdit = function(data, callback) {
	// Allow only GET requests
	if (data.method == "get") {
		// Prepare data for interpolation
		var templateData = {
			'head.title': 'Account Settings',
			'body.class': 'accountEdit'
		};

		// Read in a template as a string
		helpers.getTemplate('accountEdit', templateData, function(err, str) {
			if (!err && str) {
				// Add the universal header and footer
				helpers.addUniversalTemplates(str, templateData, function(err, str) {
					if (!err && str) {
						// Return the page as HTML
						callback(200, str, 'html');

					} else {
						callback(500, undefined, 'html');
					}
				});
			} else {
				callback(500, undefined, 'html');
			}
		});
	} else {
		callback(405, undefined, 'html');
	}
};

// Account has been deleted
handlers.accountDeleted = function(data, callback) {
	// Allow only GET requests
	if (data.method == "get") {
		// Prepare data for interpolation
		var templateData = {
			'head.title': 'Account Deleted',
			'head.description': 'You account has been deleted.',
			'body.class': 'accountDeleted'
		};

		// Read in a template as a string
		helpers.getTemplate('accountDeleted', templateData, function(err, str) {
			if (!err && str) {
				// Add the universal header and footer
				helpers.addUniversalTemplates(str, templateData, function(err, str) {
					if (!err && str) {
						// Return the page as HTML
						callback(200, str, 'html');

					} else {
						callback(500, undefined, 'html');
					}
				});
			} else {
				callback(500, undefined, 'html');
			}
		});
	} else {
		callback(405, undefined, 'html');
	}
};

// Menu
handlers.menuPage = function(data, callback) {
	// Allow only GET requests
	if (data.method == "get") {
		// Prepare data for interpolation
		var error = typeof(data.queryStringObject.error) == 'string' ? '<div class="blurb">' + data.queryStringObject.error + '</div>' : '';
		var templateData = {
			'head.title': 'Menu',
			'head.description': 'Choose your pizza!',
			'body.class': 'menuPage',
			'body.error': error
		};

		// Read in a template as a string
		helpers.getTemplate('menuPage', templateData, function(err, str) {
			if (!err && str) {
				// Add the universal header and footer
				helpers.addUniversalTemplates(str, templateData, function(err, str) {
					if (!err && str) {
						// Return the page as HTML
						callback(200, str, 'html');

					} else {
						callback(500, undefined, 'html');
					}
				});
			} else {
				callback(500, undefined, 'html');
			}
		});
	} else {
		callback(405, undefined, 'html');
	}
};

// Order
handlers.orderPage = function(data, callback) {
	// Allow only GET requests
	if (data.method == "get") {
		// Prepare data for interpolation
		var templateData = {
			'head.title': 'Review Your Order',
			'body.class': 'orderPage'
		};

		// Read in a template as a string
		helpers.getTemplate('orderPage', templateData, function(err, str) {
			if (!err && str) {
				// Add the universal header and footer
				helpers.addUniversalTemplates(str, templateData, function(err, str) {
					if (!err && str) {
						// Return the page as HTML
						callback(200, str, 'html');

					} else {
						callback(500, undefined, 'html');
					}
				});
			} else {
				callback(500, undefined, 'html');
			}
		});
	} else {
		callback(405, undefined, 'html');
	}
};

// Thnks Page
handlers.thanksPage = function(data, callback) {
	// Allow only GET requests
	if (data.method == "get") {
		// Get the token from the headers
		var token = typeof(data.queryStringObject.token) == 'string' ? data.queryStringObject.token : false;

		// Lookup the user by reading the token
		_data.read('tokens', token, function(err, tokenData) {
			if (!err && tokenData) {
				_data.read('users', tokenData.phone, function(err, userData) {
					if (!err && userData) {
						// Prepare data for interpolation
						var deliveryTime = Date.now() + 1000 * 60 * 60;
						var options = {hour: '2-digit', minute: '2-digit'};
						var americanDateTime = new Intl.DateTimeFormat('en-US', options).format;
						var templateData = {
							'head.title': 'Thank you for your order',
							'body.class': 'thanksPage',
							'body.time': americanDateTime(deliveryTime),
							'body.email': userData.email
						};

						// Read in a template as a string
						helpers.getTemplate('thanksPage', templateData, function(err, str) {
							if (!err && str) {
								// Add the universal header and footer
								helpers.addUniversalTemplates(str, templateData, function(err, str) {
									if (!err && str) {
										// Return the page as HTML
										callback(200, str, 'html');

									} else {
										callback(500, undefined, 'html');
									}
								});
							} else {
								callback(500, undefined, 'html');
							}
						});
					} else {
						callback(404, undefined, 'html');
					}
				});
			} else {
				callback(404, undefined, 'html');
			}
		});
	} else {
		callback(405, undefined, 'html');
	}
};

// Favicon
handlers.favicon = function(data, callback) {
	// Allow only GET requests
	if (data.method == "get") {
		// Read in the favicon's data
		helpers.getStaticAsset('favicon.ico', function(err, data) {
			if (!err && data) {
				callback(200, data, 'favicon'); 
			} else {
				callback(500);
			}
		});
	} else {
		callback(405);
	}
};

// Create new session
handlers.sessionCreate = function(data, callback) {
	// Allow only GET requests
	if (data.method == "get") {
		// Prepare data for interpolation
		var templateData = {
			'head.title': 'Login to your Accont',
			'head.description': 'Please enter your phone number and password to access your account.',
			'body.class': 'sessionCreate'
		}

		// Read in a template as a string
		helpers.getTemplate('sessionCreate', templateData, function(err, str) {
			if (!err && str) {
				// Add the universal header and footer
				helpers.addUniversalTemplates(str, templateData, function(err, str) {
					if (!err && str) {
						// Return the page as HTML
						callback(200, str, 'html');

					} else {
						callback(500, undefined, 'html');
					}
				});
			} else {
				callback(500, undefined, 'html');
			}
		});
	} else {
		callback(405, undefined, 'html');
	}
};

// Public assets
handlers.public = function(data, callback) {
	// Allow only GET requests
	if (data.method == "get") {
		// Get the file name being requested
		var trimmedAssetName = data.trimmedPath.replace('public/', '').trim();
		if (trimmedAssetName.length > 0) {
			// Read in the favicon's data
			helpers.getStaticAsset(trimmedAssetName, function(err, data) {
				if (!err && data) {
					// Determine the content type (default to plain text)
					var contentType = 'plain';
					if (trimmedAssetName.indexOf('.css') > -1) {
						contentType = 'css';
					}
					if (trimmedAssetName.indexOf('.png') > -1) {
						contentType = 'png';
					}
					if (trimmedAssetName.indexOf('.jpg') > -1) {
						contentType = 'jpg';
					}
					if (trimmedAssetName.indexOf('.ico') > -1) {
						contentType = 'favicon';
					}
					callback(200, data, contentType); 
				} else {
					callback(404);
				}
			});
		} else {
			callback(404);
		}
	} else {
		callback(405);
	}
};


/*
 * JSON API handlers 
 *
 */

// Users handler
handlers.users = function(data, callback) {
	var acceptableMethods = ['post', 'get', 'put', 'delete'];
	if (acceptableMethods.indexOf(data.method) > -1) {
		handlers._users[data.method](data, callback);
	} else {
		callback(405);
	}	
};

// Container for the user submethods
handlers._users = {};

// Users - post
// Required data: firstName, lastName, phone, email, address, password, tosAgreement
// Optional data: none
handlers._users.post = function(data, callback) {
	// Check the reqired fields are filled out
	var firstName = typeof(data.payload.firstName) == 'string' &&
					data.payload.firstName.trim().length > 0 ? 
					data.payload.firstName.trim() :
					false;
	var lastName = typeof(data.payload.lastName) == 'string' &&
					data.payload.lastName.trim().length > 0 ? 
					data.payload.lastName.trim() :
					false;
	var phone = typeof(data.payload.phone) == 'string' &&
					data.payload.phone.trim().length == 10 ? 
					data.payload.phone.trim() :
					false;
	var email = typeof(data.payload.email) == 'string' &&
					helpers.isEmail(data.payload.email.trim()) ? 
					data.payload.email.trim() :
					false;
	var address = typeof(data.payload.address) == 'string' &&
					data.payload.address.trim().length > 0 ? 
					data.payload.address.trim() :
					false;
	var password = typeof(data.payload.password) == 'string' &&
					data.payload.password.trim() > 0 ? 
					data.payload.password.trim() :
					false;
	var tosAgreement = typeof(data.payload.tosAgreement) == 'boolean' &&
					data.payload.tosAgreement == true ? 
					true :
					false;

	if (firstName && lastName && phone && email && address && password && tosAgreement) {
		// Make sure that the user doesn't already exist
		_data.read('users', phone, function(err, data) {
			if ( err) {
				// Hash the password
				var hashedPassword = helpers.hash(password);

				if (hashedPassword) {

					// Create the user object
					var userObject = {
						'firstName': firstName,
						'lastName': lastName,
						'phone': phone,
						'email': email,
						'address': address,
						'hashedPassword': hashedPassword,
						'tosAgreement': tosAgreement,
						'orders': [],
						'date': Date.now()
					};

					// Store the user
					_data.create('users', phone, userObject, function(err) {
						if (!err) {
							callback(200);
						} else {
							console.log(err);
							callback(500, {'Error': 'Could not create a new user'});
						}
					});
				} else {
					callback(500, {'Error': 'Could not hash a user\'s password'});
				}

			} else {
				callback(400, {'Error': 'A user with phone ' + phone + ' already exists'});
			}
		});

	} else {
		callback(400, {'Error': 'Missing required fields'});
	}
};

// Users - get
// Required data: phone
// Optional data: none
handlers._users.get = function(data, callback) {
	// Check that the phone number is valid
	var phone = typeof(data.queryStringObject.phone) == 'string' &&
				data.queryStringObject.phone.trim().length == 10 ?
				data.queryStringObject.phone.trim() :
				false;
	if (phone) {
		// Get the token from the headers
		var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;

		// Verify that the tokken is valid for the phone
		handlers._tokens.verifyToken(token, phone, function(tokenIsValid) {
			if (tokenIsValid) {
				// Look up the user
				_data.read('users', phone, function(err, data) {
					if (!err && data) {
						// Remove the hased password before returning the user object
						delete data.hashedPassword;
						callback(200, data);
					} else {
						callback(404);
					}
				});

			} else {
				callback(403, {'Error': 'Missing required token in headers or token is invalid'});
			}
		});

	} else {
		callback(400, {'Error': 'Missing phone number'});
	}
	 
};

// Users - put
// Required data: phone
// Optional data: everything else (at least one should be specified)
handlers._users.put = function(data, callback) {
	// Check that the phone number is valid
	var phone = typeof(data.payload.phone) == 'string' &&
				data.payload.phone.trim().length == 10 ?
				data.payload.phone.trim() :
				false;
	// Check for the optional fields
	var firstName = typeof(data.payload.firstName) == 'string' &&
					data.payload.firstName.trim().length > 0 ? 
					data.payload.firstName.trim() :
					false;
	var lastName = typeof(data.payload.lastName) == 'string' &&
					data.payload.lastName.trim().length > 0 ? 
					data.payload.lastName.trim() :
					false;
	var email = typeof(data.payload.email) == 'string' &&
					helpers.isEmail(data.payload.email.trim()) ? 
					data.payload.email.trim() :
					false;
	var address = typeof(data.payload.address) == 'string' &&
					data.payload.address.trim().length > 0 ? 
					data.payload.address.trim() :
					false;
	var password = typeof(data.payload.password) == 'string' &&
					data.payload.password.trim() > 0 ? 
					data.payload.password.trim() :
					false;

	// Error if the phone number is invalid and no optional data provided
	if (phone && (firstName || lastName || email || address || password)) {
		// Get the token from the headers
		var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;

		// Verify that the tokken is valid for the phone
		handlers._tokens.verifyToken(token, phone, function(tokenIsValid) {
			if (tokenIsValid) {
				// Look up the user
				_data.read('users', phone, function(err, userData) {
					if (!err && data) {
						// Update the fields
						if (firstName) {
							userData.firstName = firstName;
						}
						if (lastName) {
							userData.lastName = lastName;
						}
						if (email) {
							userData.email = email;
						}
						if (address) {
							userData.address = address;
						}
						if (password) {
							userData.hashedPassword = helpers.hash(password);
						}

						// Store the new updates
						_data.update('users', phone, userData, function(err) {
							if (!err) {
								callback(200);
							} else {
								console.log(err);
								callback(500, {'Error': 'Could not update the user object'});
							}
						});
					} else {
						callback(400, {'Error': 'The specified user does not exist'});
					}
				})

			} else {
				callback(403, {'Error': 'Missing required token in headers or token is invalid'});
			}
		});

	} else {
		callback(400, {'Error': 'Missing required fields'});
	}
};

// Users - delete
// Required data: phone
// Optional data: none
handlers._users.delete  = function(data, callback) {
	// Check that the phone number is valid
	var phone = typeof(data.queryStringObject.phone) == 'string' &&
				data.queryStringObject.phone.trim().length == 10 ?
				data.queryStringObject.phone.trim() :
				false;
	if (phone) {
		// Get the token from the headers
		var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;

		// Verify that the tokken is valid for the phone
		handlers._tokens.verifyToken(token, phone, function(tokenIsValid) {
			if (tokenIsValid) {
				// Look up the user
				_data.read('users', phone, function(err, userData) {
					if (!err && userData) {
						_data.delete('users', phone, function(err) {
							if (!err) {
								callback(200);
							} else {
								console.log(err);
								callback(500, {'Error': 'Could not delete the specified user'});
							}
						})
					} else {
						callback(400, {'Error': 'Could not find the specified user'});
					}
				});
			} else {
				callback(403, {'Error': 'Missing required token in headers or token is invalid'});
			}
		});

	} else {
		callback(400, {'Error': 'Missing phone number'});
	}	 
};

// Tokens handler
handlers.tokens = function(data, callback) {
	var acceptableMethods = ['post', 'get', 'put', 'delete'];
	if (acceptableMethods.indexOf(data.method) > -1) {
		handlers._tokens[data.method](data, callback);
	} else {
		callback(405);
	}	
};

// Container for the tokens methods
handlers._tokens = {};

// Tokens - post
// Required data: phone, password
// Optional data: none
handlers._tokens.post = function(data, callback) {
	var phone = typeof(data.payload.phone) == 'string' &&
					data.payload.phone.trim().length == 10 ? 
					data.payload.phone.trim() :
					false;
	var password = typeof(data.payload.password) == 'string' &&
					data.payload.password.trim() > 0 ? 
					data.payload.password.trim() :
					false;
	if (phone && password) {
		// Look up the user
		_data.read('users', phone, function(err, userData) {
			if (!err && userData) {
				// Hash the sent password and compare it to the stored password
				var hashedPassword = helpers.hash(password);
				if (hashedPassword == userData.hashedPassword) {
					// If valid, create a new token with expiration date 1 hour in future
					var tokenId = helpers.createRandomString(20);
					var expires = Date.now() + 1000 * 60 * 60;
					var tokenObject = {
						'phone': phone,
						'id': tokenId,
						'expires': expires
					};

					// Store the token
					_data.create('tokens', tokenId, tokenObject, function(err) {
						if (!err) {
							callback(200, tokenObject);
						} else {
							console.log(err);
							callback(500, {'Error': 'Could create a new token'});
						}
					})
				} else {
					callback(400, {'Error': 'Invalid password provided'});
				}
			} else {
				callback(400, {'Error': 'Could not find the specified user'});
			}
		})

	} else {
		callback(400, {'Error': 'Missing required fields'});
	}
}

// Tokens - get
// Required data: id
// Optional data: none
handlers._tokens.get = function(data, callback) {
	// Check the id is valid
	var id = typeof(data.queryStringObject.id) == 'string' &&
				data.queryStringObject.id.trim().length == 20 ?
				data.queryStringObject.id.trim() :
				false;
	if (id) {
		// Look up the token
		_data.read('tokens', id, function(err, tokenData) {
			if (!err && tokenData) {
				callback(200, tokenData);
			} else {
				callback(404);
			}
		});
	} else {
		callback(400, {'Error': 'Missing valid token'});
	}
}	

// Tokens - put
// Required data: id, extend
// Optional data: none
handlers._tokens.put = function(data, callback) {
	var id = typeof(data.payload.id) == 'string' &&
					data.payload.id.trim().length == 20 ? 
					data.payload.id.trim() :
					false;
	var extend = typeof(data.payload.extend) == 'boolean' ? 
					data.payload.extend :
					false;
	if (id && extend) {
		// Look up the token
		_data.read('tokens', id, function(err, tokenData) {
			 if (!err && tokenData) {
			 	// Check the token is not expired
			 	if (tokenData.expires > Date.now()) {
			 		// Set the expiration 1 hour from now
			 		tokenData.expires = Date.now() + 1000 * 60 * 60;

			 		// Store the new updates
			 		_data.update('tokens', id, tokenData, function(err) {
			 			if (!err) {
			 				callback(200, tokenData);
			 			} else {
			 				console.log(err);
			 				callback(500, {'Error': 'Could not extend token'});
			 			}
			 		})
			 	} else {
			 		callback(400, {'Error': 'The token has expired'});
			 	} 

			 } else {
			 	callback(400, {'Error': 'Specified token does not exist'});
			 }
		});

	} else {
		callback(400, {'Error': 'Missing required field(s) or they are invalid'});
	}
}

// Tokens - delete
// Required data: id
// Optional data: none
handlers._tokens.delete = function(data, callback) {
	// Check that the id is valid
	var id = typeof(data.queryStringObject.id) == 'string' &&
				data.queryStringObject.id.trim().length == 20 ?
				data.queryStringObject.id.trim() :
				false;
	if (id) {
		// Look up the token
		_data.read('tokens', id, function(err, tokenData) {
			if (!err && tokenData) {
				_data.delete('tokens', id, function(err) {
					if (!err) {
						callback(200);
					} else {
						console.log(err);
						callback(500, {'Error': 'Could not delete the specified token'});
					}
				})
			} else {
				callback(400, {'Error': 'Could not find the specified token'});
			}
		});
	} else {
		callback(400, {'Error': 'Missing phone number'});
	}
};

// Verify that the current token id is valid for the current user
handlers._tokens.verifyToken = function(id, phone, callback) {
	// Look up the token
	_data.read('tokens', id, function(err, tokenData) {
		if (!err && tokenData) {
			// Check the token is for the given user and has not expired
			if (tokenData.phone == phone && tokenData.expires > Date.now()) {
				callback(true);
			} else {
				callback(false);
			}
		} else {
			callback(false);
		}
	})
};

// Menu handler
handlers.menu = function(data, callback) {
	var acceptableMethods = ['get'];
	if (acceptableMethods.indexOf(data.method) > -1) {
		handlers._menu[data.method](data, callback);
	} else {
		callback(405);
	}	
};

// Container for the tokens methods
handlers._menu = {};

// Menu - get
// Required data: none
// Optional data: none
handlers._menu.get = function(data, callback) {
	// The user doesn't need to be logged in or registered to get the menu
	_data.read('menu', 'menu', function(err, menuData) {
		if (!err && menuData) {
			callback(200, menuData);
		} else {
			callback(500, {'Error': 'Could not read the menu data file'});
		}
	});
};

// Carts handler
handlers.carts= function(data, callback) {
	var acceptableMethods = ['post', 'get', 'put', 'delete'];
	if (acceptableMethods.indexOf(data.method) > -1) {
		handlers._carts[data.method](data, callback);
	} else {
		callback(405);
	}	
};

// Container for all the checks methods
handlers._carts = {};

// Carts - post
// Required data: items with quantity in format {imem1: quantity1, item2: quantity2, ...}
// Optional data: none
handlers._carts.post = function(data, callback) {

	// Get the token from the headers
	var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;

	// Lookup the user by reading the token
	_data.read('tokens', token, function(err, tokenData) {
		if (!err && tokenData) {

			// Verify that the tokken is valid
			handlers._tokens.verifyToken(token, tokenData.phone, function(tokenIsValid) {
				if (tokenIsValid) {

					// Read the menu
					_data.read('menu', 'menu', function(err, menuData) {
						if (!err && menuData) {
							// Initialize en empty shopping cart
							var cartObject = {}; // Shopping cart
							var invalidItems = {}; // Invalid items in user data payload
							var totalSum = 0; // Total summ for checkout

							// Iterate throug the payload object and add valid items to the user's shopping cart
							Object.keys(data.payload).forEach(function(item) {
								// Check that item is valid, has quantity, and calculate the total 
								if (menuData[item] && typeof(data.payload[item]) == 'number' && data.payload[item] % 1 === 0 && data.payload[item] > 0) {
									var subtotalSum = data.payload[item] * menuData[item].price;

									// Add the subtotal to the total sum
									totalSum += subtotalSum;

									// Add the item to the cart object
									cartObject[item] = {
										"quantity": data.payload[item],
										"price": menuData[item].price,
										"subtotal": subtotalSum
									};
								} else {
									// Add the item to the invalid items collection
									invalidItems[item] = data.payload[item];
								}
							});

							// Add the total sum for valid items to the cart object
							if (cartObject) {
								cartObject.total = totalSum;
							}

							// Save the shopping cart or replace the previously saved one, if already exists
							_data.create('carts', tokenData.phone, cartObject, function(err) {
								if (!err) {
									// Add invalid items to payload returned to the user
									if (invalidItems) {
										cartObject.invalidItems = invalidItems;
									}
									callback(200, cartObject);
								} else {
									_data.update('carts', tokenData.phone, cartObject, function(err) {
										if (!err) {
											// Add invalid items to payload returned to the user
											if (invalidItems) {
												cartObject.invalidItems = invalidItems;
											}
											callback(200, cartObject);
										} else {
											callback(500, {'Error': 'Could not save the shopping cart'});
										}
									});
								}
							});
						} else {
							callback(500, {'Error': 'Could not read the menu data file'});
						}
					});
				} else {
					callback(403);
				}
			});
		} else {
			callback(403);
		}
	});
};

// Carts - get
// Required data: items with quantity in format {imem1: quantity1, item2: quantity2, ...}
// Optional data: none
handlers._carts.get = function(data, callback) {
	// Get the token from the headers
	var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;

	// Lookup the user by reading the token
	_data.read('tokens', token, function(err, tokenData) {
		if (!err && tokenData) {
			// Verify that the tokken is valid
			handlers._tokens.verifyToken(token, tokenData.phone, function(tokenIsValid) {
				if (tokenIsValid) {
					// Return the shopping cart data
					_data.read('carts', tokenData.phone, function(err, cartData) {
						if (!err && cartData) {
							callback(200, cartData);
						} else {
							// Return en empty cart
							callback(201, {'total': 0});
						}
					});
				} else {
					callback(403);
				}
			});
		} else {
			callback(403);
		}
	});
};

// Carts - put
// Required data: id
// Optional data: everything else (at least one must be specified)
handlers._carts.put = function(data, callback) {
	// Get the token from the headers
	var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;

	// Lookup the user by reading the token
	_data.read('tokens', token, function(err, tokenData) {
		if (!err && tokenData) {

			// Verify that the tokken is valid
			handlers._tokens.verifyToken(token, tokenData.phone, function(tokenIsValid) {
				if (tokenIsValid) {

					// Read the menu
					_data.read('menu', 'menu', function(err, menuData) {
						if (!err && menuData) {

							// Get the saved cartData and put it into the cart object
							_data.read('carts', tokenData.phone, function(err, cartData) {
								if (!err && cartData) {
									var cartObject = cartData; // Shopping cart
									var invalidItems = {}; // Invalid items in user data payload
									var totalSum = cartObject.total; // Total sum

									// Iterate throug payload object and update valid items to the user's shopping cart
									Object.keys(data.payload).forEach(function(item) {
										// Check that the item is valid, has quantity, and calculate the total (now quantity may be equal to zero if the user wants to delete item from the cart)
										if (menuData[item] && typeof(data.payload[item]) == 'number' && data.payload[item] % 1 === 0 && data.payload[item] >= 0) {
											if (data.payload[item] > 0) {
												var subtotalSum = data.payload[item] * menuData[item].price;

												// Update total sum
												if (cartObject[item]) {
													totalSum += subtotalSum - cartObject[item].subtotal;
												} else {
													totalSum += subtotalSum;
												}	

												// Update item in the cartObject
												cartObject[item] = {
													"quantity": data.payload[item],
													"price": menuData[item].price,
													"subtotal": subtotalSum
												};

											} else {
												// Delete the item from the cart, if quantity equals to 0
												if (cartObject[item]) {
													totalSum -= cartObject[item].subtotal;
													delete cartObject[item];
												} else {
													// Add the item to invalid items collection
													invalidItems[item] = data.payload[item];
												}
											}
										} else {
											// Add the item to invalid items collection
											invalidItems[item] = data.payload[item];
										}
									});

									// Update the total sum for valid items in the shopping cart
									if (cartObject) {
										cartObject.total = totalSum;
									}

									// Save the shopping cart with the updated data
									_data.update('carts', tokenData.phone, cartObject, function(err) {
										if (!err) {
											// Add invalid items to payload returned to the user
											if (invalidItems) {
												cartObject.invalidItems = invalidItems;
											}
											callback(200, cartObject);
										} else {
											callback(500, {'Error': 'Could not save the updated shopping cart'});
										}
									});

								} else {
									callback(500, {'Error': 'Could not find the saved shopping cart'});
								}
							});
						} else {
							callback(500, {'Error': 'Could not read the menu data file'});
						}
					});
				} else {
					callback(403);
				}
			});
		} else {
			callback(403);
		}
	});
};

// Carts - delete
// Required data: none
// Optional data: none
handlers._carts.delete = function(data, callback) {
	// Get the token from the headers
	var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;

	// Lookup the user by reading the token
	_data.read('tokens', token, function(err, tokenData) {
		if (!err && tokenData) {
			// Verify that the tokken is valid
			handlers._tokens.verifyToken(token, tokenData.phone, function(tokenIsValid) {
				if (tokenIsValid) {
					// Delete the shopping cart data
					_data.delete('carts', tokenData.phone, function(err) {
						if (!err) {
							callback(200);
						} else {
							callback(500, {'Error': 'The shopping cart has not been previously saved or could not been deleted'});
						}
					});
				} else {
					callback(403);
				}
			});
		} else {
			callback(403);
		}
	});
};

// Orders handler
handlers.orders = function(data, callback) {
	var acceptableMethods = ['post', 'get'];
	if (acceptableMethods.indexOf(data.method) > -1) {
		handlers._orders[data.method](data, callback);
	} else {
		callback(405);
	}	
};

// Container for the tokens methods
handlers._orders = {};

// Order - get
// Required data: none (should be payment details in production)
// Optional data: none
handlers._orders.post = function(data, callback) {
	// Get the token from the headers
	var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;

	// Lookup the user by reading the token
	_data.read('tokens', token, function(err, tokenData) {
		if (!err && tokenData) {
			// Verify that the tokken is valid
			handlers._tokens.verifyToken(token, tokenData.phone, function(tokenIsValid) {
				if (tokenIsValid) {
					// Get the shopping cart data
					_data.read('carts', tokenData.phone, function(err, cartData) {
						if (!err && cartData) {
							// If the cart is not empty, proceed payment
							if (cartData.total > 0) {
								// Create the order object
								var orderId = tokenData.phone + '_' + Date.now();
								var orderObject = {};
								orderObject.cart = cartData;
								orderObject.id = orderId;

								helpers.payWithStripe('usd', cartData.total, 'Payment for order ' + orderId, 'tok_mastercard', function(err) {
									console.log(err);
									if (!err) {
										// Send email to the user
										_data.read('users', tokenData.phone, function(err, userData) {
											if (!err && userData) {
												var subject = 'Payment is accepted';
												var text = 'Your order will be delivered within 1 hour:\n\n';
												Object.keys(cartData).forEach(function(item) {
													if (item != 'total') {
														text += item + ': \t' + cartData[item].quantity + ' x $' +
																cartData[item].price + ' = $' + cartData[item].subtotal + '\n';
													}
												});
												text += '-----------\n'
												text += 'TOTAL: $' + cartData.total;

												helpers.sendMailWithMailgun(config.mailgun.from, userData.email, subject, text, function(err) {
													if (!err) {
														// Save the order
														_data.create('orders', orderId, orderObject, function(err) {
															if (!err) {
																// Add the saved order id to the user data
																userObject = userData;
																userObject.orders.push(orderId);
																_data.update('users', tokenData.phone, userObject, function(err) {
																	// Delete the cart
																	_data.delete('carts', tokenData.phone, function(err) {
																		if (!err) {
																			callback(200);
																		} else {
																			callback(500, {'Error': 'Could not delete the shopping cart data'});
																		}
																	});
																});
													} else {
														callback(500, {'Error': 'Could not save the order data'});
													}
												});
													} else {
														callback(500, {'Error': err});
													}
												});

											} else {
												callback(500, {'Error': 'Could not read the user data'});
											}
										})
									} else {
										callback(500, {'Error': err});
									};
								});
							} else {
								callback(400, {'Error': 'The shopping cart is empty'});
							}
						} else {
							callback(500, {'Error': 'The shopping cart has not been previously saved or could not been deleted'});
						}
					});
				} else {
					callback(403);
				}
			});
		} else {
			callback(403);
		}
	});
};

// Orders - get
// Required data: none
// Optional data: order id
handlers._orders.get = function(data, callback) {
	// Get the token from the headers
	var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;

	// Lookup the user by reading the token
	_data.read('tokens', token, function(err, tokenData) {
		if (!err && tokenData) {
			// Verify that the tokken is valid
			handlers._tokens.verifyToken(token, tokenData.phone, function(tokenIsValid) {
				if (tokenIsValid) {
					// Check the order id is valid if an id is given
					var id = typeof(data.queryStringObject.id) == 'string' &&
								data.queryStringObject.id.trim().length > 10 ?
								data.queryStringObject.id.trim() :
								false;
					if (id) {
						// Verify that order id belongs to the user
						_data.read('users', tokenData.phone, function(err, userData) {
							if (!err && userData) {
								if (userData.orders.indexOf(id) > -1) {
									// Return the order details
									_data.read('orders', id, function(err, orderData) {
										if (!err && orderData) {
											callback(200, orderData);
										} else {
											callback(500, {'Error': 'Could not read the order data'});
										}
									});
								} else {
									callback(403);
								}
							} else {
								callback(500, {'Error': 'Could not find the user data'});
							}
						});
					} else {
						// If no id is given return the list of the user's order ids
						_data.read('users', tokenData.phone, function(err, userData) {
							if (!err && userData) {
								callback(200, userData.orders);
							} else {
								callback(500, {'Error': 'Could not find the user data'});
							}
						});
					}
				} else {
					callback(403);
				}
			});
		} else {
			callback(403);
		}
	});
};

// Not found handler
handlers.notFound = function(data, callback) {
	callback(404);
};


// Export module
module.exports = handlers;
