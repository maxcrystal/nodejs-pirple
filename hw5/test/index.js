/*
 * Test Runner
 *
 */

// Application logic for the test runner
var _app = {};

// Container for the test
_app.tests = {};

// Add unit tests
_app.tests.unit = require('./unit');

// Count all the tests
_app.countTests = function() {
	var counter = 0;
	for (var key in _app.tests) {
		if (_app.tests.hasOwnProperty(key)) {
			var subTests = _app.tests[key];
			for (var testName in subTests) {
				if (subTests.hasOwnProperty(testName)) {
					counter++;
				}
			}
		}
	}
	return counter;
};

// Run all the tests
_app.runTests = function() {
	var errors = [];
	var successes = 0;
	var limit = _app.countTests();
	var counter = 0;
	for (var key in _app.tests) {
		if (_app.tests.hasOwnProperty(key)) {
			var subTests = _app.tests[key];
			for (var testName in subTests) {
				if (subTests.hasOwnProperty(testName)) {
					(function() {
						var tmpTestName = testName;
						var testValue = subTests[testName];
						// Call the test
						try {
							testValue(function() {
								// If it calls back then it succeeded
								console.log('\x1b[32m%s\x1b[0m', tmpTestName);
								counter++;
								successes++;
								if (counter == limit) {
									_app.produceReport(limit, successes, errors);
								}
							});
						} catch(e) {
							errors.push({
								'name': testName,
								'error': e
							});
							console.log('\x1b[31m%s\x1b[0m', tmpTestName);
							counter++;
							if (counter == limit) {
								_app.produceReport(limit, successes, errors);
							}
						}
					})();
				}
			}
		}
	}
};

// Produce a test report
_app.produceReport = function(limit, successes, errors) {
	console.log('');
	console.log('------------------BEGIN TESTS------------------');
	console.log('');
	console.log('Total tests: ', limit);
	console.log('Pass: ', successes);
	console.log('Fails: ', errors.length);
	console.log('');

	// Error details
	if (errors.length > 0) {
		console.log('\x1b[31m%s\x1b[0m', 'ERROR DETAILS:');
		errors.forEach(function(testError) {
			console.log('\x1b[31m%s\x1b[0m', '* ' + testError.name);
			console.log('  ', testError.error);
			console.log('');
		});
	}

	console.log('');
	console.log('-------------------END TESTS-------------------');
	process.exit(0);
};

// Run the tests
_app.runTests();