/*
 * Different functions to be tested
 *
 */

// Dependencies

// Declare the app
var app = {};

// Factorial, callback error and factorial
app.factorial = function(n, callback) {
	// Check that function is called with 2 arguments
	if (arguments.length === 2) {
		// Check that 'callback' is valid function
		if (typeof(callback) == 'function' && callback.length === 2) {
			// Check that 'n' is valid argument
			if (typeof(n) == 'number' && n >= 0 && n % 1 === 0) {
				if (n === 0) {
			    	callback(false, 1);
			  	} else {
				  	app.factorial(n - 1, function(err, factorial) {
				  		if (!err) {
				  			callback(false, n * factorial);
				  		}
				  	});
				}
			} else {
				callback('Argument must be a non-negative integer', -1);
			}
		} else {
			var err = new TypeError('Callback must be a function that accepts exactly 2 arguments: string:error and number:factorial');
			err.info = { 'callbackType': typeof(callback) };
			if (typeof(callback) == 'function') {
				err.info.callbackArgumentsLength = callback.length;
			} 
			throw err;
		}
	} else {
		var err = new TypeError('app.factorial accepts exactly 2 arguments: number and callback(err, factorial)');
		err.info = {
			'argumentsLength': arguments.length,
			'arguments': arguments,
		};
		throw err;
	}
};

// Export the app
module.exports = app;