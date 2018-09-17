/*
 * HTTP2 server
 *
 */

var http2 = require('http2');
var fs = require('fs');

const options = {
  key: fs.readFileSync('../https/key.pem'),
  cert: fs.readFileSync('../https/cert.pem')
};

// Init server
var server = http2.createSecureServer(options, data=>{
  console.log(data);
});

// On a stream send back hello world html
server.on('stream', function(stream, headers) {
	stream.respond({
		'status': 200,
		'content-type': 'text/html'
	});
	stream.end('<html><body><h1>Hello world!</h1></body></html>');
});

// Listen on 3000
server.listen(3000);