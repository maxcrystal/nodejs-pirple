/*
 * Helpers
 *
 */

 // Dependencies
 var crypto = require('crypto');
 var config = require('./config');
 var https = require('https');
 var querystring = require('querystring');
 var path = require('path');
 var fs = require('fs');

// Container for all helpers
var helpers = {};

// Testing TestRunner
helpers.getANumber = function() {
	return 1;
};

// Create SHA256 hash
helpers.hash = function(str) {
	if (typeof(str) == 'string' && str.length > 0) {
		var hash = crypto.createHmac('sha256', config.hashingSecret).update(str).digest('hex');
		return hash;
	} else {
		return false;
	}
}

// Parse a JSON string to an object in all cases without throwing
helpers.parseJsonToObject = function(str) {
	try {
		var obj = JSON.parse(str);
		return obj;
	} catch(e) {
		return {};
	}
}

// Create a random string of a given length
helpers.createRandomString = function(strLength) {
	strLength = typeof(strLength) == 'number' && strLength > 0 ? strLength : false;
	if (strLength) {
		// Definr possible characters
		var possibleCharacters = 'qwertyuiopasdfghjklzxcvbnm1234567890';

		// Start the final string
		var str = '';
		for(i = 1; i <= strLength; i++) {
			// Get a random character
			var randomCharacter = possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));
			// Append it to the final string
			str += randomCharacter;
		}

		// Return the final string
		return str;
	} else {
		return false;
	}
}

// Send an SMS via Twilio
helpers.sendTwilioSms = function(phone, msg, callback) {
	// Validate parameters
	phone = typeof(phone) == 'string' && phone.trim().length == 10 ? phone.trim() : false;
	msg = typeof(msg) == 'string' && msg.trim().length > 0 && msg.trim().length <= 1600 ? msg.trim() : false;
	if (phone && msg) {
		// Configure the request payload
		var payload = {
			'From': config.twilio.fromPhone,
			'To': '+1' + phone,
			'Body': msg
		}

		// Stringify the payload
		var stringPayload = querystring.stringify(payload);

		// Configure the request details
		var requestDetails = {
			'protocol': 'https:',
			'hostname': 'api.twilio.com',
			'method': 'POST',
			'path': '/2010-04-01/Accounts/' + config.twilio.accountSid + '/Messages.json',
			'auth': config.twilio.accountSid + ':' + config.twilio.authToken,
			'headers': {
				'Content-Type': 'application/x-www-form-urlencoded',
				'Content-Length': Buffer.byteLength(stringPayload)
			}
		};

		// Instantiate the request object
		var req = https.request(requestDetails, function(res) {
			// Grab the status of the sent request
			var status = res.statusCode;

			// Callback successfully if the request went through
			if (status == 200 || status == 201) {
				callback(false);
			} else {
				callback('Status code returned was ' + status);
			}
		});

		// Bind to the error event so it doesn't get thrown
		req.on('error', function(e) {
			callback(e);
		});

		// Add the pauload
		req.write(stringPayload);

		// End the request
		req.end();

	} else {
		callback('Giving parameters were missing or invalid');
	}
};

// Get the string content of the template
helpers.getTemplate = function(templateName, data, callback) {
	templateName = typeof(templateName) == 'string' && templateName.length > 0 ? templateName : false;
	data = typeof(data) == 'object' && data !== null ? data: {}; 
	if (templateName) {
		var templatesDir = path.join(__dirname, '/../templates/');
		fs.readFile(templatesDir + templateName + '.html', 'utf8', function(err, str) {
			if (!err && str && str.length > 0) {
				// Do interpolation on the string
				var finalString = helpers.interpolate(str, data);
				callback(false, finalString);
			} else {
				callback('No template could be found');
			}
		});
	} else {
		callback('A valid template name was not specified');
	}
};

// Add the standard header and footer to the string and pass them provided data object for interpolation
helpers.addUniversalTemplates = function(str, data, callback) {
	str = typeof(str) == 'string' && str.length > 0 ? str: '';
	data = typeof(data) == 'object' && data !== null ? data: {}; 

	// Get the header
	helpers.getTemplate('_header', data, function(err, headerString) {
		if (!err && headerString) {
			// Get the footer
			helpers.getTemplate('_footer', data, function(err, footerString) {
				if (!err && footerString) {
					// Add them all together
					var fullString = headerString + str + footerString;
					callback(false, fullString);
				} else {
					callback('Could not find the footer template')
				}
			});
		} else {
			callback('Could not find the header template');
		}
	});
};

// Take a given string and a data object and find/replace all the keys within it
helpers.interpolate = function(str, data) {
	str = typeof(str) == 'string' && str.length > 0 ? str: '';
	data = typeof(data) == 'object' && data !== null ? data: {}; 

	// Add the templateGlobals to the data object, prepending prepending their key names with 'gllbal'
	for (var keyName in config.templateGlobals) {
		if(config.templateGlobals.hasOwnProperty(keyName)) {
			data['global.' + keyName] = config.templateGlobals[keyName];
		}
	}

	// For each key in data object insert its value into the string at the corresponding placehilder
	for (var key in data) {
		if (data.hasOwnProperty(key) && typeof(data[key]) == 'string') {
			var replace = data[key];
			var find = '{' + key + '}';
			str = str.replace(find, replace);
		}
	}

	return str;
};

// Get the contents of static (public) assets
helpers.getStaticAsset = function(fileName, callback) {
	fileName = typeof(fileName) == 'string' && fileName.length > 0 ? fileName : false;
	if (fileName) {
		var publicDir = path.join(__dirname, '/../public/');
		fs.readFile(publicDir + fileName, function(err, data) {
			if (!err && data) {
				callback(false, data);
			} else {
				callback('The file is not found');
			}
		});
	} else {
		callback('File name is invalid');
	}
};

// Export module
module.exports = helpers;