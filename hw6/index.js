/*
 * Primary file for the API
 *
 */

 // Dependencies
var http = require('http');
var https = require('https');
var url = require('url');
var StringDecoder = require('string_decoder').StringDecoder;
var config = require('./config');
var fs = require('fs');
var cpus = require('os').cpus().length;
var cluster = require('cluster');

if (cluster.isMaster) {
	console.log('\x1b[31m%s\x1b[0m', `Master ${process.pid} has started`);

	// Fork workers
	for (var i = 0; i < cpus; i++) {
		cluster.fork();
	}

	// Log when the worker exits
	cluster.on('exit', function(worker, code, signal) {
		console.log('\x1b[34m%s\x1b[0m', `Worker ${worker.process.pid} has exited with code ${code}`);
	});

} else {
	console.log('\x1b[34m%s\x1b[0m', `Worker ${process.pid} has started`);

	// Instantiate HTTP server
	var httpServer = http.createServer(function(req, res){	
		unifiedServer(req, res);
	});

	// Instantiate HTTPS server
	var httpsServerOptions = {
		'key' : fs.readFileSync('./https/key.pem'),
		'cert' : fs.readFileSync('./https/cert.pem')
	};
	var httpsServer = https.createServer(httpsServerOptions, function(req, res){	
		unifiedServer(req, res);
	});

	// Start the HTTP server
	httpServer.listen(config.httpPort, function(){
		console.log('\x1b[35m%s\x1b[0m', 'The server is listening on port ' + config.httpPort);
	});

	// Start HTTPS server
	httpsServer.listen(config.httpsPort, function(){
		console.log('\x1b[36m%s\x1b[0m', 'The server is listening on port ' + config.httpsPort);
	});

	// Unified server logic for http and https requests
	var unifiedServer = function(req, res){

		// Get the URl and parse it
		var parsedUrl = url.parse(req.url, true);

		// Get the path
		var path = parsedUrl.pathname; 
		var trimmedPath = path.replace(/^\/+|\/+$/g, '');

		// Get the query string object
		var queryStringObject = parsedUrl.query;

		// Get the HTTP method
		var method = req.method.toLowerCase();

		// Get the headers object
		var headers = req.headers;

		// Get the payload, if any
		var decoder = new StringDecoder('utf-8');
		var buffer = '';
		req.on('data', function(data){
			buffer += decoder.write(data);
		});
		req.on('end', function(){
			buffer += decoder.end();

			// Choose the handler this request should go to or notFound handler
			var chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

			// Construct the data object to send to handler
			var data = {
				'trimmedPath': trimmedPath,
				'queryStringObject': queryStringObject,
				'method': method,
				'headers': headers,
				'payload': buffer
			};

			// Route the request to the handler specified in the router
			chosenHandler(data, function(statusCode, payload){
				// Use the status code defined by the handler or default to 200
				statusCode = typeof(statusCode) == 'number' ? statusCode : 200;

				// Use the payload defined by the handler or default to an empty object
				payload = typeof(payload) == 'object' ? payload : {};

				// Convert payload to a string
				var payloadString = JSON.stringify(payload);

				// Return the response
				res.setHeader('Content-Type', 'application/json');
				res.writeHead(statusCode);
				res.end(payloadString);
				console.log('');
				console.log('\x1b[33m%s\x1b[0m', `Worker ${process.pid} has responded for request "${method.toUpperCase()} ${path}" with status code ${statusCode}:`);
				console.dir(payloadString, {'colors': true});

			});

		});

		// Define the handlers
		var handlers = {};

		// Hello handler
		handlers.hello = function(data, callback){
			if (data.method == 'post') {
				var answer = {
					'hello' : 'This is home work #6',
					'payload' : data.payload,
					'query' : data.queryStringObject,
					'worker': process.pid
				};
				callback(200, answer);
			} else {
				callback(406);
			}
		};

		// Ping handler
		handlers.ping = function(data, callback) {
			callback(200);
		};

		// Not found handler
		handlers.notFound = function(data, callback) {
			callback(404);
		};

		// Define a request router
		var router = {
			'hello' : handlers.hello,
			'ping' : handlers.ping
		};
	}
};
 