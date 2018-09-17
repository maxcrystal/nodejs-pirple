/*
 * UDP server
 *
 */

var dgram = require('dgram');

// Create a server
var server = dgram.createSocket('udp4');

server.on('message', function(messageBuffer, sender) {
	var messageString = messageBuffer.toString();
	console.log(messageString);
});

server.bind(6000);