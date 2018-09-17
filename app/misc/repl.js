/*
 * REPL server
 *
 */

var repl = require('repl');

// Start the REPL
repl.start({
	'prompt': '>',
	'eval': function(str) {
		// Evaluation function for inputs
		console.log('At the evaluation stage: ', str);

		// Say 'buzz' back to 'fizz'
		if (str.indexOf('fizz') > -1) {
			console.log('buzz');
		}
	}
});