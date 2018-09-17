/*
 * Request handlers
 *
 */


// Dependencies
var _data = require('./data');
var helpers = require('./helpers');
var config = require('./config');
var _url = require('url');
var dns = require('dns'); 
var {
  performance,
  PerformanceObserver
} = require('perf_hooks');
var util = require('util');
var debug = util.debuglog('performance');

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
			'head.title': 'Uptime Monitoring - Made Simple',
			'head.description': 'Simple and free uptime monitoring for HTTP/HTTPS sites',
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

// Create new session
handlers.sessionCreate = function(data, callback) {
	// Allow only GET requests
	if (data.method == "get") {
		// Prepare data for interpolation
		var templateData = {
			'head.title': 'Login to your Accont',
			'head.description': 'Please enter your phone number and password to access your account.',
			'body.class': 'sessionCreate'
		};

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

// Delete the session (logout)
handlers.sessionDeleted = function(data, callback) {
	// Allow only GET requests
	if (data.method == "get") {
		// Prepare data for interpolation
		var templateData = {
			'head.title': 'Logged Out',
			'head.description': 'You have been logged out of your acoount.',
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

// Create a check
handlers.checksCreate = function(data, callback) {
	// Allow only GET requests
	if (data.method == "get") {
		// Prepare data for interpolation
		var templateData = {
			'head.title': 'Create a New Check',
			'body.class': 'checksCreate'
		};

		// Read in a template as a string
		helpers.getTemplate('checksCreate', templateData, function(err, str) {
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

// Dashboard
handlers.checksList = function(data, callback) {
	// Allow only GET requests
	if (data.method == "get") {
		// Prepare data for interpolation
		var templateData = {
			'head.title': 'Dashboard',
			'body.class': 'checksList'
		};

		// Read in a template as a string
		helpers.getTemplate('checksList', templateData, function(err, str) {
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
				console.log(err, str);
				callback(500, undefined, 'html');
			}
		});
	} else {
		callback(405, undefined, 'html');
	}
};

// Edit a check
handlers.checksEdit = function(data, callback) {
	// Allow only GET requests
	if (data.method == "get") {
		// Prepare data for interpolation
		var templateData = {
			'head.title': 'Check Details',
			'body.class': 'checksEdit'
		};

		// Read in a template as a string
		helpers.getTemplate('checksEdit', templateData, function(err, str) {
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
				console.log(err, str);
				callback(500, undefined, 'html');
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

// Example error
handlers.exampleError = function(data, callback) {
	var err = new Error('This is an example error');
	throw(err);
};

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
// Required data: firstName, lastName, phone, password, tosAgreement
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
	var password = typeof(data.payload.password) == 'string' &&
					data.payload.password.trim() > 0 ? 
					data.payload.password.trim() :
					false;
	var tosAgreement = typeof(data.payload.tosAgreement) == 'boolean' &&
					data.payload.tosAgreement == true ? 
					true :
					false;

	if (firstName && lastName && phone && password && tosAgreement) {
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
						'hashedPassword': hashedPassword,
						'tosAgreement': tosAgreement
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
	var password = typeof(data.payload.password) == 'string' &&
					data.payload.password.trim() > 0 ? 
					data.payload.password.trim() :
					false;

	// Error if the phone number is invalid and no optional data provided
	if (phone && (firstName || lastName || password)) {
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
								// Delete all the checks assosiated with the user
								var userChecks = typeof(userData.checks) == 'object' &&
												 userData.checks instanceof Array ?
												 userData.checks : []; 
								var checksToDelete = userChecks.length;
								if (checksToDelete > 0) {
									var checksDeleted = 0;
									var deletionErrors = false;
									// Loop through the checks
									userChecks.forEach(function(checkId) {
										// Delete the check
										_data.delete('checks', checkId, function(err) {
											if (err) {
												deletionErrors = true;
											}
											checksDeleted++;
											if (checksDeleted == checksToDelete) {
												if (!deletionErrors) {
													callback(200);
												} else {
													callback(500, {'Error': 'Errors encountered while attempting to delete all of the user\'s checks'});
												}
											}
										})
									});
								} else {
									callback(200);
								}
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

// Not found handler
handlers.notFound = function(data, callback) {
	callback(404);
};

// Container for the tokens methods
handlers._tokens = {};

// Tokens - post
// Required data: phone, password
// Optional data: none
handlers._tokens.post = function(data, callback) {
	var observer = new PerformanceObserver(function(list, observer) {
			var measurements = list.getEntries();
			measurements.forEach(function(measurement ) {
				debug('\x1b[36m%s\x1b[0m', measurement.name + ': ' + measurement.duration);
			});
			performance.clearMarks();
			observer.disconnect();
		});
		observer.observe({
			entryTypes: ['measure'],
			buffered: true
		});
	performance.mark('entered function');
	var phone = typeof(data.payload.phone) == 'string' &&
					data.payload.phone.trim().length == 10 ? 
					data.payload.phone.trim() :
					false;
	var password = typeof(data.payload.password) == 'string' &&
					data.payload.password.trim() > 0 ? 
					data.payload.password.trim() :
					false;
	performance.mark('inputs validated');
	if (phone && password) {
		// Look up the user
		performance.mark('beginnig user lookup');
		_data.read('users', phone, function(err, userData) {
			performance.mark('user lookup complete');
			if (!err && userData) {
				// Hash the sent password and compare it to the stored password
				performance.mark('beginnig password hashing');
				var hashedPassword = helpers.hash(password);
				performance.mark('password hashed');
				if (hashedPassword == userData.hashedPassword) {
					// If valid, create a new token with expiration date 1 hour in future
					performance.mark('creating data for token');
					var tokenId = helpers.createRandomString(20);
					var expires = Date.now() + 1000 * 60 * 60;
					var tokenObject = {
						'phone': phone,
						'id': tokenId,
						'expires': expires
					};

					// Store the token
					performance.mark('beginnig storing token');
					_data.create('tokens', tokenId, tokenObject, function(err) {
						performance.mark('token stored');

						// Gathering performance measurements
						performance.measure('Beginning to end', 'entered function', 'token stored');
						performance.measure('Validating inputs', 'entered function', 'inputs validated');
						performance.measure('User lookup', 'beginnig user lookup', 'user lookup complete');
						performance.measure('Password hashing', 'beginnig password hashing', 'password hashed');
						performance.measure('Token creation', 'creating data for token', 'beginnig storing token');
						performance.measure('Token storing', 'beginnig storing token', 'token stored');

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

// Checks handler
handlers.checks = function(data, callback) {
	var acceptableMethods = ['post', 'get', 'put', 'delete'];
	if (acceptableMethods.indexOf(data.method) > -1) {
		handlers._checks[data.method](data, callback);
	} else {
		callback(405);
	}	
};

// Container for all the checks methods
handlers._checks = {};

// Checks - post
// Required data: protocol, url, method, successCodes, timeoutSeconds
// Optional data: none
handlers._checks.post = function(data, callback) {
	// Validate inputs
	var protocol = typeof(data.payload.protocol) == 'string' &&
					['https', 'http'].indexOf(data.payload.protocol) > -1 ? 
					data.payload.protocol :
					false;
	var url = typeof(data.payload.url) == 'string' &&
					data.payload.url.trim().length > 0 ? 
					data.payload.url.trim() :
					false;
	var method = typeof(data.payload.method) == 'string' &&
					['post', 'get', 'put', 'delete'].indexOf(data.payload.method) > -1 ? 
					data.payload.method :
					false;
	var successCodes = typeof(data.payload.successCodes) == 'object' &&
					data.payload.successCodes instanceof Array &&
					data.payload.successCodes.length > 0 ? 
					data.payload.successCodes :
					false;
	var timeoutSeconds = typeof(data.payload.timeoutSeconds) == 'number' &&
					data.payload.timeoutSeconds % 1 === 0 &&
					data.payload.timeoutSeconds >= 1 &&
					data.payload.timeoutSeconds <= 5 ? 
					data.payload.timeoutSeconds :
					false;

	if (protocol && url && method && successCodes && timeoutSeconds) {
		// Get the token from the headers
		var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;

		// Lookup the user by reading the token
		_data.read('tokens', token, function(err, tokenData) {
			if (!err && tokenData) {
				var userPhone = tokenData.phone;

				// Lookup the user data
				_data.read('users', userPhone, function(err, userData) {
					if (!err && userData) {
						var userChecks = typeof(userData.checks) == 'object' &&
										 userData.checks instanceof Array ?
										 userData.checks : []; 
						// Verify that user has less than max checks per user
						if (userChecks.length < config.maxChecks) {
							// Verify that URL has DNS entries and so can resolve
							var parsedUrl = _url.parse(protocol + '://' + url, true);
							var hostName = typeof(parsedUrl.hostname) == 'string' &&
										   parsedUrl.hostname.length > 0 ?
										   parsedUrl.hostname : false;
							dns.resolve(hostName, function(err, records) {
								if (!err && records) {
									// Create the random id for the check
									var checkId = helpers.createRandomString(20);

									// Create the check object and include the user's phone
									var checkObject = {
										'id': checkId,
										'userPhone': userPhone,
										'protocol': protocol,
										'url': url,
										'method': method,
										'successCodes': successCodes,
										'timeoutSeconds': timeoutSeconds
									};

									// Save the object
									_data.create('checks', checkId, checkObject, function(err) {
										if (!err) {
											// Add the check id to the users object
											 userData.checks = userChecks;
											 userData.checks.push(checkId);

											 // Save the new user data
											 _data.update('users', userPhone, userData, function(err) {
											 	if (!err) {
											 		// Return the data about the new check
											 		callback(200, checkObject);
											 	} else {
											 		callback(500, {'Error': 'Could not update the user with the new check'});
											 	}
											 });
										} else {
											callback(500, {'Error': 'Could not create a new check'});
										}
									});
								} else {
									callback(400, {'Error': 'The hostname has no DNS entries'});
								}
							});
						} else {
							callback(400, {'Error': 'The user has already the maximum number of checks (' + config.maxChecks + ')'});
						}
					} else {
						callback(403);
					}
				});
			} else {
				callback(403);
			}
		});
	} else {
		callback(400, {'Error': 'Missing required inputs, or inputs are invalid'});
	}
};

// Checks - get
// Required data: id
// Optional data: none
handlers._checks.get = function(data, callback) {
	// Check that the phone number is valid
	var id = typeof(data.queryStringObject.id) == 'string' &&
				data.queryStringObject.id.trim().length == 20 ?
				data.queryStringObject.id.trim() :
				false; 
	if (id) {
		// Lookup the check
		_data.read('checks', id, function(err, checkData) {
			if (!err && checkData) {
				// Get the token from the headers
				var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;

				// Verify that the tokken is valid and belongs to the user who created the check
				handlers._tokens.verifyToken(token, checkData.userPhone, function(tokenIsValid) {
					if (tokenIsValid) {
						// Return the check data
						callback(200, checkData);
					} else {
						callback(403);
					}
				});
			} else {
				callback(404);
			}
		});
	}
};

// Checks - put
// Required data: id
// Optional data: everything else (at least one must be specified)
handlers._checks.put = function(data, callback) {
	// Check that the phone number is valid
	var id = typeof(data.payload.id) == 'string' &&
				data.payload.id.trim().length == 20 ?
				data.payload.id.trim() :
				false;
	// Check for the optional fields
	var protocol = typeof(data.payload.protocol) == 'string' &&
					['https', 'http'].indexOf(data.payload.protocol) > -1 ? 
					data.payload.protocol :
					false;
	var url = typeof(data.payload.url) == 'string' &&
					data.payload.url.trim().length > 0 ? 
					data.payload.url.trim() :
					false;
	var method = typeof(data.payload.method) == 'string' &&
					['post', 'get', 'put', 'delete'].indexOf(data.payload.method) > -1 ? 
					data.payload.method :
					false;
	var successCodes = typeof(data.payload.successCodes) == 'object' &&
					data.payload.successCodes instanceof Array &&
					data.payload.successCodes.length > 0 ? 
					data.payload.successCodes :
					false;
	var timeoutSeconds = typeof(data.payload.timeoutSeconds) == 'number' &&
					data.payload.timeoutSeconds % 1 === 0 &&
					data.payload.timeoutSeconds >= 1 &&
					data.payload.timeoutSeconds <= 5 ? 
					data.payload.timeoutSeconds :
					false;

	// Error if the id is invalid and no optional data provided
	if (id && (protocol || url || method || successCodes || timeoutSeconds )) {
		// Lookup the check
		_data.read('checks', id, function(err, checkData) {
			if (!err && checkData) {
				// Get the token from the headers
				var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;

				// Verify that the tokken is valid for the phone
				handlers._tokens.verifyToken(token, checkData.userPhone, function(tokenIsValid) {
					if (tokenIsValid) {
						// Update the check where necessary
						if (protocol) { checkData.protocol = protocol; }
						if (url) { checkData.url = url; }
						if (method) { checkData.method = method; }
						if (successCodes) { checkData.successCodes = successCodes; }
						if (timeoutSeconds) { checkData.timeoutSeconds = timeoutSeconds; }

						// Store the updates
						_data.update('checks', id, checkData, function(err) {
							if (!err) {
								callback(200);
							} else {
								callback(500, {'Error': 'Could not update the check'});
							}
						});
					} else {
						callback(403);
					}
				});
			} else {
				callback(400, {'Error': "Check ID is not exist"});
			}
		});
	} else {
		callback(400, {'Error': 'Missing required fields'});
	}
};

// Checks - delete
// Required data: id
// Optional data: none
handlers._checks.delete = function(data, callback) {
	// Check that the id is valid
	var id = typeof(data.queryStringObject.id) == 'string' &&
				data.queryStringObject.id.trim().length == 20 ?
				data.queryStringObject.id.trim() :
				false;
	if (id) {
		// Lookup the check
		_data.read('checks', id, function(err, checkData) {
			if (!err && checkData) {
				// Get the token from the headers
				var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;

				// Verify that the tokken is valid for the phone
				handlers._tokens.verifyToken(token, checkData.userPhone, function(tokenIsValid) {
					if (tokenIsValid) {
						// Delete the check data
						_data.delete('checks', id, function(err) {
							if (!err) {
								// Look up the user
								_data.read('users', checkData.userPhone, function(err, userData) {
									if (!err && userData) {
										var userChecks = typeof(userData.checks) == 'object' &&
														 userData.checks instanceof Array ?
														 userData.checks : []; 

										// Remove the deleted check from the checks list
										var checkPosition = userChecks.indexOf(id);
										if (checkPosition > -1) {
											userChecks.splice(checkPosition, 1);
											// Save the users data
											_data.update('users', checkData.userPhone, userData, function(err) {
												if (!err) {
													callback(200);
												} else {
													console.log(err);
													callback(500, {'Error': 'Could not update the user'});
												}
											});
										} else {
											callback(500, {'Error': 'Could not find the check in the user\'s checks list'});
										}
									} else {
										callback(500, {'Error': 'Could not find the user who created the check'});
									}
								});
							} else {
								callback(500, {'Error': 'Could not delete the check data'});
							}
						})
			} else {
				callback(403);
			}
		});
			} else {
				callback(400, {'Error': 'The specified check ID does not exist'});
			}
		});

	} else {
		callback(400, {'Error': 'Missing id number'});
	}
};

// Export module
module.exports = handlers;