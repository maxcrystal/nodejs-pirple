/*
 * Unit Tests
 *
 */

// Dependancies
var app = require('./../index');
var assert = require('assert');
var http = require('http');
var config = require('./../lib/config');

// Holder for the tests
var api = {};

// Helpers
var helpers = {};

helpers.makeGetRequest = function(path, callback) {
	var requestDetails = {
		'protocol': 'http:',
		'hostname': 'localhost',
		'port': config.httpPort,
		'method': 'GET',
		'path': path,
		'headers': {
			'Content-Type': 'application/json'
		}
	};

	var req = http.request(requestDetails, function(res) {
		callback(res);
	});
	req.end();
}

// Tests
api['app.init() should not throw an error'] = function(done) {
	assert.doesNotThrow(function() {
		app.init(function(err){
			done();
		});
	}, TypeError);
};

api['GET /ping should return status code 200'] = function(done) {
	helpers.makeGetRequest('/ping', function(res) {
		assert.equal(res.statusCode, 200);
		done();
	})
};

api['GET /api/users should return status code 400'] = function(done) {
	helpers.makeGetRequest('/api/users', function(res) {
		assert.equal(res.statusCode, 400);
		done();
	})
};

api['GET wrong path should return status code 404'] = function(done) {
	helpers.makeGetRequest('/wrong/path', function(res) {
		assert.equal(res.statusCode, 404);
		done();
	})
};

// Export the test
module.exports = api;