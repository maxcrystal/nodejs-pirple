/*
 * Unit Tests
 *
 */

// Dependancies
var app = require('./../app');
var assert = require('assert'); 

// Holder for the tests
var unit = {};
var n = 0;

// Tests
unit[++n + ') app.factorial does not throw an error if called properly and returns no error and non-negative integer'] = function(done) {
	var randomNumber = Math.floor(Math.random() * 100);
	assert.doesNotThrow(function() {
		app.factorial(randomNumber, function(err, factorial) {
			assert.ok(!err);
			assert.ok(typeof(factorial) == 'number');
			assert.ok(factorial >= 0);
			done();
		});
	}, TypeError);
};

unit[++n + ') app.factorial returns an error message and -1 if called with negative number'] = function(done) {
	app.factorial(-4, function(err, factorial) {
		assert.ok(err);
		assert.equal(factorial, -1);
		done();
	});
};

unit[++n + ') app.factorial returns an error message and -1 if called with decimal number'] = function(done) {
	app.factorial(2.2, function(err, factorial) {
		assert.ok(err);
		assert.equal(factorial, -1);
		done();
	});
};

unit[++n + ') app.factorial returns an error message and -1 if called with not a number'] = function(done) {
	app.factorial('hello', function(err, factorial) {
		assert.ok(err);
		assert.equal(factorial, -1);
		done();
	});
};

unit[++n + ') app.factorial(4) returns 24'] = function(done) {
	app.factorial(4, function(err, factorial) {
		assert.ok(!err);
		assert.equal(factorial, 24);
		done();
	});
};

unit[++n + ') app.factorial throws an error if called with not exactly 2 arguments'] = function(done) {
	assert.throws(function() {
		app.factorial(5);
	}, {
		'name': 'TypeError',
		'message': /2 arguments/,
	});
	done();
};

unit[++n + ') app.factorial throws an error if the second argument is not a function which accepts exactly 2 arguments'] = function(done) {
	assert.throws(function() {
		app.factorial(5, 'not a function');
	}, {
		'name': 'TypeError',
		'message': /2 arguments/,
	});
	assert.throws(function() {
		app.factorial(5, function(only_one_arg){});
	}, {
		'name': 'TypeError',
		'message': /2 arguments/,
	});
	done();
};

// Failed test
unit[++n + ') This test should be failed'] = function(done) {
	assert.doesNotThrow(function() {
		app.factorial(6, function(err){});
		done();
	}, TypeError);
};

// Export tests
module.exports = unit;