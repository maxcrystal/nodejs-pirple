/*
 * Primary file for the API
 *
 */

// Dependencies
var server = require('./lib/server');
var workers = require('./lib/workers');
var cli = require('./lib/cli');

// Declare the app
var app = {};

// Init function
app.init = function(callback) {
	// Start the server
	server.init();

	// Start the workers
	workers.init();

	// Satr the CLI
	setTimeout(function() {
		cli.init();
		callback();
	}, 50);
};

// Execute only if required directly
if (require.main === module) {
	app.init(function(){});
}

// Export the app
module.exports = app;