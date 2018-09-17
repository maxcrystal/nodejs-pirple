/*
 * Create and export configuration variables
 *
 */

//  Container for all the environments
var environments = {};

// Staging (default) environments
environments.staging = {
	'httpPort' : 3000,
	'httpsPort' : 3001,
	'envName' : 'staging',
	'hashingSecret' : 'this is a secret',
	'maxChecks' : 5,
	'twilio' : {
		'accountSid' : 'ACb32d411ad7fe886aac54c665d25e5c5d',
    	'authToken' : '9455e3eb3109edc12e3d8c92768f7a67',
    	'fromPhone' : '+15005550006'
	},
	'templateGlobals': {
		'appName': 'UptimeChecker',
		'companyName': 'Evil corp., Inc.',
		'yearCreated': '2018',
		'baseUrl': 'http://localhost:3000/'
	}
};

environments.testing = {
	'httpPort' : 4000,
	'httpsPort' : 4001,
	'envName' : 'testing',
	'hashingSecret' : 'this is a secret',
	'maxChecks' : 5,
	'twilio' : {
		'accountSid' : 'ACb32d411ad7fe886aac54c665d25e5c5d',
    	'authToken' : '9455e3eb3109edc12e3d8c92768f7a67',
    	'fromPhone' : '+15005550006'
	},
	'templateGlobals': {
		'appName': 'UptimeChecker',
		'companyName': 'Evil corp., Inc.',
		'yearCreated': '2018',
		'baseUrl': 'http://localhost:3000/'
	}
};

// Production environments
environments.production = {
	'httpPort' : 5000,
	'httpsPort' : 5001,
	'envName' : 'production',
	'hashingSecret' : 'this is a super secret',
	'maxChecks' : 5,
	'twilio' : {
		'accountSid' : 'ACb32d411ad7fe886aac54c665d25e5c5d',
    	'authToken' : '9455e3eb3109edc12e3d8c92768f7a67',
    	'fromPhone' : '+15005550006'
	},
	'templateGlobals': {
		'appName': 'UptimeChecker',
		'companyName': 'Evil corp., Inc.',
		'yearCreated': '2018',
		'baseUrl': 'http://localhost:5000/'
	}
};

// Determine which environment was passed as a command-line argument
var currentEnvironment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

// Check that the current environment is one of the environments above, if not, default to staging
var environmentToExport =  typeof(environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments.staging;
 
// Export thne module
module.exports = environmentToExport;