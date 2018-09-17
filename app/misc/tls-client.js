/*
 * TLS client
 *
 */


var tls = require('tls');
var fs = require('fs');
var path = require('path');

// Server options
var options = {
	// ca - cretifacate authority, required only because we use self-signed certificate
	'ca' : fs.readFileSync(path.join(__dirname, '/../https/cert.pem'))
};

// Define message
var outboundMessage = 'ping';

// Create the client
var client = tls.connect(6000, options, function() {
	// Send the message
	client.write(Buffer.from(outboundMessage));
});

// When the server writes back, log it out
client.on('data', function(inboundMessage) {
	var messageString = inboundMessage.toString();
	console.log(messageString);
	client.end();
});