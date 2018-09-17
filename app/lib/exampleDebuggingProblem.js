/*
 * Debugging problem example library
 *
 */

var example = {};

example.init = function() {
	// Error: bar is not defined
	var foo = bar;
};

module.exports = example;