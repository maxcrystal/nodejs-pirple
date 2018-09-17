/*
 * UDP client
 *
 */

 var dgram = require('dgram');

 // Create a client

var client = dgram.createSocket('udp4');

// Define a message
var messageString = "A message!";
var messageBuffer = Buffer.from(messageString);

// Send off the message
client.send(messageBuffer, 6000, 'localhost', function(err) {
	client.close();
})