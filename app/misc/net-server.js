/*
 * TCP server
 *
 */


var net = require('net');

// Create server
var server = net.createServer(function(connection) {
	// Send 'pong'
	var outboundMessage = 'pong';
	connection.write(outboundMessage);

	// When the client write something, log it out
	connection.on('data', function(inboundMessage) {
		var messageString = inboundMessage.toString();
		console.log(messageString);
	});
});

server.listen(6000);