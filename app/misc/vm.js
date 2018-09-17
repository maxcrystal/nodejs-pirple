/*
 * VM example
 *
 */

var vm = require('vm');

// Define a context to run script in
var context = {
	'foo': 25
};

// Define the script
var script = new vm.Script(`
	foo = foo * 25;
	var bar = foo + 1;
	var fizz = 52;
`);

// Run the script
script.runInNewContext(context);
console.log(context);