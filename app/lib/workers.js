/* 
 * Worker-related tasks
 *
 */

// Dependecies
var path = require('path');
var fs = require('fs');
var _data = require('./data');
var https = require('https');
var http = require('http');
var helpers = require('./helpers');
var url = require('url');
var _logs = require('./logs');
var util = require('util');
var debug = util.debuglog('workers');


// Instantiate the worker object
var workers = {};

// Lookup all the checks, get their data, send to a validator
workers.gatherAllChecks = function() {
	// Get all the checks
	_data.list('checks', function(err, checks) {
		if (!err && checks && checks.length > 0) {
			checks.forEach(function(check) {
				// Read in the check data
				_data.read('checks', check, function(err, originalCheckData) {
					if (!err && originalCheckData) {
						// Pass it to the check validator
						workers.validateCheckData(originalCheckData);
					} else {
						debug('Error reading one of the checks data');
					}
				}); 
			});
		} else {
			debug('Error: could not find any check\'s to process');
		}
	});
};

// Sanity-check the check-data
workers.validateCheckData = function(originalCheckData) {
	originalCheckData =  typeof(originalCheckData) == 'object' && originalCheckData != null ? originalCheckData : {};
	originalCheckData.id = typeof(originalCheckData.id) == 'string' &&
						   originalCheckData.id.trim().length == 20 ?
						   originalCheckData.id.trim() : false;
	originalCheckData.userPhone = typeof(originalCheckData.userPhone) == 'string' &&
						   		  originalCheckData.userPhone.trim().length == 10 ?
						   		  originalCheckData.userPhone.trim() : false;
	originalCheckData.protocol = typeof(originalCheckData.protocol) == 'string' &&
						   		 ['http', 'https'].indexOf(originalCheckData.protocol) > -1 ?
						   		 originalCheckData.protocol : false;
	originalCheckData.url = typeof(originalCheckData.url) == 'string' &&
						   	originalCheckData.url.trim().length > 0 ?
						   	originalCheckData.url.trim() : false;
	originalCheckData.method = typeof(originalCheckData.method) == 'string' &&
						   	   ['post', 'get', 'put', 'delete'].indexOf(originalCheckData.method) > -1 ?
						   	   originalCheckData.method : false;
	originalCheckData.successCodes = typeof(originalCheckData.successCodes) == 'object' &&
						   		     originalCheckData.successCodes instanceof Array &&
						   		     originalCheckData.successCodes.length > 0 ?
						   		     originalCheckData.successCodes : false;
	originalCheckData.timeoutSeconds = typeof(originalCheckData.timeoutSeconds) == 'number' &&
									   originalCheckData.timeoutSeconds % 1 === 0 &&
									   originalCheckData.timeoutSeconds >= 1 && 
									   originalCheckData.timeoutSeconds <= 5 ?
									   originalCheckData.timeoutSeconds : false;

	// Set the keys that may not be set (if the workers have not seen this check before)
	originalCheckData.state = typeof(originalCheckData.state) == 'string' &&
						   	  ['up', 'down'].indexOf(originalCheckData.state) > -1 ?
						   	  originalCheckData.state : 'down';
	originalCheckData.lastChecked = typeof(originalCheckData.lastChecked) == 'number' &&
									originalCheckData.lastChecked > 0 ?
									originalCheckData.lastChecked : false;

	// If all checks are passed go to the next step
	 if (originalCheckData.id &&
	 	 originalCheckData.userPhone &&
	 	 originalCheckData.protocol &&
	 	 originalCheckData.url &&
	 	 originalCheckData.method &&
	 	 originalCheckData.successCodes &&
	 	 originalCheckData.timeoutSeconds) {
	 	workers.performCheck(originalCheckData);
	 } else {
	 	debug('Error: one of the checks is not properly formatted. Skipping it');
	 }
};

// Perform the check
workers.performCheck = function(originalCheckData) {
	// Prepare the  initial check outcome
	var checkOutcome = {
		'error': false,
		'responseCode': false
	};

	// Mark that the outcome has not been sent yet
	var outcomeSent = false;

	// Parse the hostname and the path out of original check data
	var parsedUrl = url.parse(originalCheckData.protocol + '://' + originalCheckData.url, true);
	var hostName = parsedUrl.hostname;
	var path = parsedUrl.path; // Using path and not pathname because we want to use query string

	// Construct the request
	var requestDetails = {
		'protocol': originalCheckData.protocol + ':',
		'hostname': hostName,	
		'method': originalCheckData.method.toUpperCase(),
		'path': path,
		'timeout': originalCheckData.timeoutSeconds * 1000
	};

	// Instantiate the request object (using http or https module)
	var _moduleToUse = ['http', 'https'].indexOf(originalCheckData.protocol) === 0 ? http : https;
	var req = _moduleToUse.request(requestDetails, function(res) {
		// Grab the status of the sent request
		var status = res.statusCode;

		// Update the checkOutcome
		checkOutcome.responseCode = status;
		if (!outcomeSent) {
			workers.processCheckOutcome(originalCheckData, checkOutcome);
			outcomeSent = true;
		}
	});

	// Bind to the error event so it doesn't get thrown
	req.on('error', function(e) {
		// Update the checkOutcome
		checkOutcome.error = {
			'error': true,
			'value': e
		};
		if (!outcomeSent) {
			workers.processCheckOutcome(originalCheckData, checkOutcome);
			outcomeSent = true;
		}
	});

	// Bind to the timeout event
	req.on('timeout', function(e) {
		// Update the checkOutcome
		checkOutcome.error = {
			'error': true,
			'value': 'timeout'
		};
		if (!outcomeSent) {
			workers.processCheckOutcome(originalCheckData, checkOutcome);
			outcomeSent = true;
		}
	});

	// End the request
	req.end();
};

// Process the check outcome
workers.processCheckOutcome = function(originalCheckData, checkOutcome) {
	// Decide if the check is considered up or down
	var state = !checkOutcome.error && 
	 			 checkOutcome.responseCode && 
	 			 originalCheckData.successCodes.indexOf(checkOutcome.responseCode) > -1 ?
	 			 'up' : 'down';
	// Decide if an alert is warranted
	var alertWarranted = originalCheckData.lastChecked &&
						 originalCheckData.state !== state ?
						 true : false;

	// Log the outcome
	var timeOfCheck = Date.now();
	workers.log(originalCheckData, checkOutcome, state, alertWarranted, timeOfCheck);

	// Update the check data
	var newCheckData = originalCheckData;
	newCheckData.state = state;
	newCheckData.lastChecked = timeOfCheck;

	// Save the update
	_data.update('checks', newCheckData.id, newCheckData, function(err) {
		if (!err) {
			// Send the new check data
			if (alertWarranted) {
				workers.alertUserToStatusChange(newCheckData);
			} else {
				debug('Check outcome has not changed, no alert needed');
			}
		} else {
			debug('Error trying to save updates to one of the checks');
		}
	});
};

// Alert the user about check status change
workers.alertUserToStatusChange = function(newCheckData) {
	var msg = 'Alert: your check for ' + newCheckData.method.toUpperCase() + ' ' +
			  newCheckData.protocol + '://' + newCheckData.url + ' is currently ' +
			  newCheckData.state;
	helpers.sendTwilioSms(newCheckData.userPhone, msg, function(err) {
		if (!err) {
			debug('Success: user was alerted to a status change:', msg);
		} else {
			debug('Error: could not send sms alert');
		}
	});
};

// Logger
workers.log = function(originalCheckData, checkOutcome, state, alertWarranted, timeOfCheck) {
	// Form the log data
	var logData = {
		'check': originalCheckData,
		'outcome': checkOutcome,
		'state': state,
		'alert': alertWarranted,
		'time': timeOfCheck 
	};

	// Convert data to a string
	var logString = JSON.stringify(logData);

	// Determine the log file name
	var logFileName = originalCheckData.id;

	// Append the log string to a file
	_logs.append(logFileName, logString, function(err) {
		if (!err) {
			debug('Logging succeeded');
		} else {
			debug('Logging failed');
		}
	});
};

// Timer to execute the worker process once per minute
workers.loop = function() {
	setInterval(function() {
		workers.gatherAllChecks();
	}, 1000 * 60);
};

// Rotata (compress) log files
workers.rotateLogs = function() {
	// List non-compressed logs
	_logs.list(false, function(err, logs) {
		if (!err && logs && logs.length > 0) {
			logs.forEach(function(logName){
				// Compress the data to a different file
				var logId = logName.replace('.log', '');
				var newFileId = logId + '-' + Date.now();
				_logs.compress(logId, newFileId, function(err) {
					if (!err) {
						// Truncate the log
						_logs.truncate(logId, function(err) {
							if (!err) {
								debug('Success truncating the log file');
							} else {
								debug('Error truncating the log file');
							}
						});
					} else {
						debug('Error compressing one of the log files', err);
					}
				});
			});
		} else {
			debug('Could not find logs');
		}
	});
};

// Timer to execute log-rotation process once per day
workers.logRotationLoop = function() {
	setInterval(function() {
		workers.rotateLogs();
	}, 1000 * 60 * 60 * 24);
};

// Init script
workers.init = function() {
	// Send to console in yellow
	console.log('\x1b[33m%s\x1b[0m', 'Background workers are running');
	// Execute all the checks immediately
	workers.gatherAllChecks();
	// Call the loop to execute the checks later on
	workers.loop();
	// Compress all the logs immediately
	workers.rotateLogs();
	// Call the comperssion loop to compress logs later on
	workers.logRotationLoop();
};

// Export module
module.exports = workers;