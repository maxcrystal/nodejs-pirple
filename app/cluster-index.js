/*
 * Primary file for the API
 *
 */

// Dependencies
var server = require('./lib/server');
var workers = require('./lib/workers');
var cli = require('./lib/cli');
var os = require('os');
var cluster = require('cluster');

// Declare the app
var app = {};

// Init function
app.init = function(callback) {

	if (cluster.isMaster) {
		// Start the workers
		workers.init();

		// Satr the CLI
		setTimeout(function() {
			cli.init();
			callback();
		}, 50);

		// Fork the process
		for (var i = 0; i < os.cpus().length; i++) {
			cluster.fork();
		}

	} else {
		// Start the HTTP server
		server.init();
	}
};

// Execute only if required directly
if (require.main === module) {
	app.init(function(){});
}

// Export the app
module.exports = app;