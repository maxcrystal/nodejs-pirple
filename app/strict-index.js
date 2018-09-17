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

// Error for strict mode
foo = 'bar';

// Init function
app.init = function() {
	// Start the server
	server.init();

	// Start the workers
	workers.init();

	// Satr the CLI
	setTimeout(function() {
		cli.init();
	}, 50);
};

// Execute
app.init();

// Export the app
module.exports = app;