/*
 * HTTP2 client
 *
 */

var http2 = require('http2');

// Create client
var client = http2.connect('http://localhost:3000');

// Create a request
var req = client.request({
	':path': '/',
});

// When the message received combine them till the end
var str = '';
req.on('data', function(chunk) {
	str += chunk;
}) ;

// When reached the end log the message out
req.on('end', function() {
	console.log(str);
});

// End request
req.end();