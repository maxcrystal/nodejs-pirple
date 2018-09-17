/*
 * Unit Tests
 *
 */

// Dependancies
var helpers = require('./../lib/helpers');
var assert = require('assert');
var logs = require('./../lib/logs');
var exampleDebuggingProblem = require('./../lib/exampleDebuggingProblem'); 

// Holder for the tests
var unit = {};

// Assert getANumber returns 1
unit['helpers.getANumber returns 1'] = function(done) {
	var val = helpers.getANumber();
	assert.equal(val, 1);
	done();
};

// Assert getANumber returns number
unit['helpers.getANumber returns number'] = function(done) {
	var val = helpers.getANumber();
	assert.equal(typeof(val), 'number');
	done();
};

// Assert getANumber returns 2
unit['helpers.getANumber returns 2'] = function(done) {
	var val = helpers.getANumber();
	assert.equal(val, 2);
	done();
};

// logs.list should callback an array and a false error
unit['logs.list callback false error and an array of log names'] = function(done) {
	logs.list(true, function(err, logFileNames) {
		assert.equal(err, false);
		assert.ok(logFileNames instanceof Array);
		assert.ok(logFileNames.length > 1);
		done();
	});
};

// logs.truncate should not throw even if log file does not exist
unit['logs.truncate should not throw an error if log file does not exist'] = function(done) {
	assert.doesNotThrow(function() {
		logs.truncate('does_not_exist.log', function(err) {
			assert.ok(err);
			done();
		})
	}, TypeError);
};

// exampleDebuggingProblem.init should not throw (but it does)
unit['exampleDebuggingProblem.init should not throw an error'] = function(done) {
	assert.doesNotThrow(function() {
		exampleDebuggingProblem.init();
		done();
	}, TypeError);
};

// Export the module
module.exports = unit;