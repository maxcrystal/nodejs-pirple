/*
 * Primary file for the API
 *
 */

// Dependencies
var server = require('./lib/server');
var workers = require('./lib/workers');
var cli = require('./lib/cli');
var exampleDebuggingProblem = require('./lib/exampleDebuggingProblem');

// Declare the app
var app = {};

// Init function
app.init = function() {
	// Start the server
	debugger;
	server.init();
	debugger;

	// Start the workers
	debugger;
	workers.init();
	debugger;

	// Satr the CLI
	debugger;
	setTimeout(function() {
		cli.init();
		debugger;
	}, 50);

	// Error
	var foo = 1;
	debugger;
	foo++;
	debugger;
	foo = foo * foo;
	debugger;
	foo = foo.toString();
	debugger;
	exampleDebuggingProblem.init();
	debugger;
};

// Execute
app.init();

// Export the app
module.exports = app;