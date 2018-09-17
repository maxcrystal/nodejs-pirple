/*
 * TCP client
 *
 */


var net = require('net');

// Define message
var outboundMessage = 'ping';

// Create the client
var client = net.createConnection({'port': 6000}, function() {
	// Send the message
	client.write(Buffer.from(outboundMessage));
});

// When the server writes back, log it out
client.on('data', function(inboundMessage) {
	var messageString = inboundMessage.toString();
	console.log(messageString);
	client.end();
});