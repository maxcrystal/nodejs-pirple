/*
 * Helpers
 *
 */

 // Dependencies
 var crypto = require('crypto');
 var config = require('./config');
 var https = require('https');
 var querystring = require('querystring');
 var util = require('util');
 var debugStripe = util.debuglog('stripe');
 var debugMailgun = util.debuglog('mailgun');

// Container for all helpers
var helpers = {};

// Create SHA256 hash
helpers.hash = function(str) {
	if (typeof(str) == 'string' && str.length > 0) {
		var hash = crypto.createHmac('sha256', config.hashingSecret).update(str).digest('hex');
		return hash;
	} else {
		return false;
	}
}

// Parse a JSON string to an object in all cases without throwing
helpers.parseJsonToObject = function(str) {
	try {
		var obj = JSON.parse(str);
		return obj;
	} catch(e) {
		return {};
	}
}

// Create a random string of a given length
helpers.createRandomString = function(strLength) {
	strLength = typeof(strLength) == 'number' && strLength > 0 ? strLength : false;
	if (strLength) {
		// Definr possible characters
		var possibleCharacters = 'qwertyuiopasdfghjklzxcvbnm1234567890';

		// Start the final string
		var str = '';
		for(i = 1; i <= strLength; i++) {
			// Get a random character
			var randomCharacter = possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));
			// Append it to the final string
			str += randomCharacter;
		}

		// Return the final string
		return str;
	} else {
		return false;
	}
}

// Send an SMS via Twilio
helpers.sendTwilioSms = function(phone, msg, callback) {
	// Validate parameters
	phone = typeof(phone) == 'string' && phone.trim().length == 10 ? phone.trim() : false;
	msg = typeof(msg) == 'string' && msg.trim().length > 0 && msg.trim().length <= 1600 ? msg.trim() : false;
	if (phone && msg) {
		// Configure the request payload
		var payload = {
			'From': config.twilio.fromPhone,
			'To': '+1' + phone,
			'Body': msg
		}

		// Stringify the payload
		var stringPayload = querystring.stringify(payload);

		// Configure the request details
		var requestDetails = {
			'protocol': 'https:',
			'hostname': 'api.twilio.com',
			'method': 'POST',
			'path': '/2010-04-01/Accounts/' + config.twilio.accountSid + '/Messages.json',
			'auth': config.twilio.accountSid + ':' + config.twilio.authToken,
			'headers': {
				'Content-Type': 'application/x-www-form-urlencoded',
				'Content-Length': Buffer.byteLength(stringPayload)
			}
		};

		// Instantiate the request object
		var req = https.request(requestDetails, function(res) {
			// Grab the status of the sent request
			var status = res.statusCode;

			// Callback successfully if the request went through
			if (status == 200 || status == 201) {
				callback(false);
			} else {
				callback('Status code returned was ' + status);
			}
		});

		// Bind to the error event so it doesn't get thrown
		req.on('error', function(e) {
			callback(e);
		});

		// Add the pauload
		req.write(stringPayload);

		// End the request
		req.end();

	} else {
		callback('Giving parameters were missing or invalid');
	}
};

// Validate email (https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript)
helpers.isEmail = function(email) {
	var re = /^(([^<>()[\]\\.,;:\s@\']+(\.[^<>()[\]\\.,;:\s@\']+)*)|(\'.+\'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(String(email).toLowerCase());
};

// Stripe payment
helpers.payWithStripe = function(currency, amount, description, cardToken, callback) {
// Process the payment using STRIPE
                                
    // Configure the request payload
    var stripePayload = {
        'currency': currency,
        'amount':  amount * 100, // amount in cents
        'description': description,
        'source': cardToken
    }

    var stringStripePayload = querystring.stringify(stripePayload);
    
    // Configure the request details
    var stripeRequestDetails = {
        'protocol': 'https:',
        'hostname': 'api.stripe.com',
        'method': 'POST',
        'port': 443,
        'path': '/v1/charges',
        'headers': {
            'Content-Type':'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(stringStripePayload),
            'Authorization': 'Bearer '+ config.stripe.secret
        }
    }

    // Instantiate the request object
    var stripeReq = https.request(stripeRequestDetails,function(res){
        // Grab the status of the sent request
        var status =  res.statusCode;
        debugStripe('Stripe debug info:', res);

        // Callback successfully if the request went through
        if(status == 200 || status == 201) {
            callback(false);
        } else {
            callback('Transaction failure');
        }
    });

    // Bind to the error event so it doesn't get thrown
    stripeReq.on('error',function(e){
        callback(e);
    });

    // Add the payload
    stripeReq.write(stringStripePayload);

    // End the stripeRequest
    stripeReq.end();
};

// Send an email with Mailgun
helpers.sendMailWithMailgun = function(from, to, subject, text, callback) {
    // Configure the request payload
    var mailgunPayload = {
        'from': from,
        'to': to,
        'subject': subject,
        'text': text  
    }

    var stringMailgunPayload = querystring.stringify(mailgunPayload);

    // Configure the request details
    var mailgunRequestDetails = {
        'protocol': 'https:',
        'hostname': 'api.mailgun.net',
        'path': '/v3/sandbox4494b3e8468445cd81f94823537b614e.mailgun.org',
        'port': 443,
        'method': 'POST',
        'headers': {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(stringMailgunPayload),
            'auth': 'api:'+ config.mailgun.apiKey
        }
    }

    // Instantiate the request object
    var mailgunReq = https.request(mailgunRequestDetails,function(res) {
        // Grab the status of the sent request
        var status =  res.statusCode;
        debugMailgun('Mailgun debug info:', res);
       
        // Callback successfully if the request went through
        if(status == 200 || status == 201){
        	console.log('\nFrom: ' + from);
        	console.log('To: ' + to);
        	console.log('Subject: ' + subject);
        	console.log('\n' + text + '\n');

            callback(false);                                
        } else{
            callback('Could not send email');
        }
    });

    // Bind to the error event so it doesn't get thrown
    mailgunReq.on('error',function(e){
        callback(e);
    });

    // Add the payload
    mailgunReq.write(stringMailgunPayload);

    // End the mailgunRequest
    mailgunReq.end();
};

// Export module
module.exports = helpers;