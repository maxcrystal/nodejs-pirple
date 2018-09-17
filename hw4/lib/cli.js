/*
 * CLI tasks
 *
 */

// Dependencies
var readline = require('readline');
var util = require('util');
var debug = util.debuglog('cli');
var events = require('events');
class _events extends events{};
var e = new _events();
var os = require('os');
var v8 = require('v8');
var _data = require('./data');
var helpers = require('./helpers');

// Instantiate cli object
var cli = {};

// CLI stdout decorators
// Create a vertical space
cli.verticalSpace = function(lines) {
    lines = typeof(lines) == 'number' && lines > 0 ? lines : 1;
    for (var i = 0; i < lines; i++) {
        console.log('');
    }
};

// Create a horizontal line across the screen
cli.horizontalLine = function(){

    // Get the available screen size
    var width = process.stdout.columns;

    // Put in enough dashes to go across the screen
    var line = '';
    for (var i = 0; i < width; i++) {
        line+='-';
    }
    console.log(line);
};

// Create centered text on the screen
cli.centered = function(str){
    str = typeof(str) == 'string' && str.trim().length > 0 ? str.trim() : '';

    // Get the available screen size
    var width = process.stdout.columns;

    // Calculate the left padding there should be
    var leftPadding = Math.floor((width - str.length) / 2);

    // Put in left padded spaces before the string itself
    var line = '';
    for (var i = 0; i < leftPadding; i++) {
        line += ' ';
    }
    line += str;
    console.log(line);
};

// Create a header
cli.header = function(str) {
  cli.horizontalLine();
    cli.centered(str);
    cli.horizontalLine();
    cli.verticalSpace();
};

// Input handlers
e.on('man', function(str) {
	cli.responders.help();
});

e.on('help', function(str) {
	cli.responders.help();
});

e.on('exit', function(str) {
	process.exit(0);
});

e.on('stats', function(str) {
	cli.responders.stats();
});

e.on('menu', function(str) {
  cli.responders.menu();
});

e.on('list orders', function(str) {
  cli.responders.listOrders(str);
});

e.on('more order info', function(str) {
  cli.responders.moreOrderInfo(str);
});

e.on('list users', function(str) {
	cli.responders.listUsers(str);
});

e.on('more user info', function(str) {
	cli.responders.moreUserInfo(str);
});
 
// Responders object
cli.responders = {};

cli.responders.help = function() {
	// Codify the commands and their explanations
  	var commands = {
    	'exit': 'Kill the CLI (and the rest of the application)',
    	'man': 'Show this help page',
    	'help': 'Alias of the "man" command',
    	'stats': 'Get statistics on the underlying operating system and resource utilization',
      'menu': 'List all the current menu items',
      'list orders [--last]': 'List all the recent orders in the system (optionally with `--last` list all the orders placed in the last 24 hours)',
      'more order info --{orderId}': 'Show the details of a specific order by order ID',
    	'list users [--last]': 'List all the user (optionally with `--last` list all the users who have signed up in the last 24 hours',
    	'more user info --{userId | email}': 'Show the details of a specified user by userId (phone) or email address',
  	};

  	// Show a header for the help page that is as wide as the screen
  	cli.header('CLI MANUAL');

  	// Show each command, followed by its explanation, in white and yellow respectively
  	for(var key in commands) {
     	if(commands.hasOwnProperty(key)) {
     		var colLength = 35;
        	var value = commands[key];
        	var line = '\x1b[33m' + key + '\x1b[0m';
        	var width = process.stdout.columns; //console.log(width, line.length);
        	var padding = colLength - key.length > 0 ? colLength - key.length : 0;
        	

        	for (i = 0; i < padding; i++) {
            	line += ' ';
        	}

        	if ((padding > 0) && (width - colLength > 20)) {
        		for (var i = 0; i < value.length; i += width - colLength) {
        			var l = value.slice(i, i + width - colLength);
        			line += l + '\n'
        			for (var j = 0; j < colLength; j++) {
        				line += ' ';
        			}
        		}
        	} else {
        		line += value;	
        	}

        	console.log(line);
        	cli.verticalSpace();
     	}
  	}
  	cli.verticalSpace(1);

  	// End with another horizontal line
  	cli.horizontalLine();
};

cli.responders.exit = function() {
	console.log('You asked for exit'); 
};

cli.responders.stats = function() {
	// Compile an object of stats
  	var stats = {
    	'Load Average' : os.loadavg().join('; '),
    	'CPU Count' : os.cpus().length,
    	'Free Memory' : os.freemem(),
    	'Current Malloced Memory' : v8.getHeapStatistics().malloced_memory,
    	'Peak Malloced Memory' : v8.getHeapStatistics().peak_malloced_memory,
    	'Allocated Heap Used (%)' : Math.round((v8.getHeapStatistics().used_heap_size / v8.getHeapStatistics().total_heap_size) * 100),
    	'Available Heap Allocated (%)' : Math.round((v8.getHeapStatistics().total_heap_size / v8.getHeapStatistics().heap_size_limit) * 100),
    	'Uptime' : os.uptime()+' Seconds'
  };

  	// Create a header for the stats
  	cli.header('SYSTEM STATISTICS');

  	// Log out each stat
  for(var key in stats){
     if(stats.hasOwnProperty(key)){
        var value = stats[key];
        var line = '\x1b[33m '+key+'\x1b[0m';
        var padding = 40 - line.length;
        for (var i = 0; i < padding; i++) {
            line += ' ';
        }
        line += value;
        console.log(line);
        cli.verticalSpace();
     }
  }

  // Create a footer for the stats
  cli.verticalSpace();
  cli.horizontalLine();

};

cli.responders.menu = function() {
  _data.read('menu', 'menu', function(err, menuData) {
    if (!err && menuData) {
      cli.header('MENU');
      Object.keys(menuData).forEach(function(item) {
        var line = menuData[item].type.toUpperCase() + ": " + item + " - $" + menuData[item].price;
        console.log(line);
        cli.verticalSpace();
      })
    }
  });
}

cli.responders.listOrders = function(str) {
  var arr = str.split('--');
  var last = typeof(arr[1]) == 'string' && arr[1].trim() == 'last' ? Date.now() - 1000 * 60 * 60 * 24 : false;

  _data.list('orders', function(err, orderIds) {
    if(!err && orderIds && orderIds.length > 0) {
      cli.header('ORDERS');
      orderIds.forEach(function(orderId) {
        _data.read('orders', orderId, function(err, orderData) {
          if (!err && orderData) {
            var orderDate = orderId.split('_')[1];
            var line = 'ID: ' + orderId + '; Total: $' + orderData.cart.total + 
                       '; Date: ' + orderDate;
            if (!last) {
              console.log(line);
              cli.verticalSpace();
            } else {
              if (orderDate >= last) {
                console.log(line);
                cli.verticalSpace();
              }
            }
          }
        });
      });
    }
  });
};

cli.responders.moreOrderInfo = function(str) {
  // Get order ID from string
  var arr = str.split('--');
  var orderId = typeof(arr[1]) == 'string' && arr[1].trim().length > 0 ? arr[1].trim() : false;

  if(orderId) {
    // Lookup the order
    _data.read('orders', orderId, function(err, orderData) {
      if(!err && orderData) {
        // Print their JSON object with text highlighting
        cli.header('ORDER ' + orderId);
        console.dir(orderData,{'colors' : true});
        cli.verticalSpace();
        cli.horizontalLine();
      }
    });
  }
};

cli.responders.listUsers = function(str) {
  var arr = str.split('--');
  var last = typeof(arr[1]) == 'string' && arr[1].trim() == 'last' ? Date.now() - 1000 * 60 * 60 * 24 : false;

	_data.list('users', function(err, userIds) {
    	if(!err && userIds && userIds.length > 0) {
        cli.header('USERS');
    		userIds.forEach(function(userId) {
      		_data.read('users', userId, function(err, userData) {
          	if (!err && userData) {
            	var line = 'Name: ' + userData.firstName + ' ' + userData.lastName + 
  	            			   '; Phone: ' + userData.phone + '; Email: ' + userData.email + 
                         '; Orders: ';
            	var numberOfOrders = typeof(userData.orders) == 'object' && 
        	            						 userData.orders instanceof Array && 
        	            						 userData.orders.length > 0 ? 
        	            						 userData.orders.length : 0;
            	line += numberOfOrders;
              if (!last) {
	            	console.log(line);
	            	cli.verticalSpace();
              } else {
                if (userData.date >= last) {
                  console.log(line);
                  cli.verticalSpace();
                }
              }
            }
      		});
    		});
    	}
  	});
};

cli.responders.moreUserInfo = function(str) {
	// Get userID or email from string
  var arr = str.split('--');
  var userIdOrEmail = typeof(arr[1]) == 'string' && arr[1].trim().length > 0 ? arr[1].trim() : false;

	if(userIdOrEmail) {
    // Lookup the user
  	_data.read('users', userIdOrEmail, function(err, userData) {
  		if(!err && userData) {
    		// Remove the hashed password
    		delete userData.hashedPassword;

    		// Print their JSON object with text highlighting
    		cli.header('USER ' + userIdOrEmail);
    		console.dir(userData,{'colors' : true});
    		cli.verticalSpace();
    		cli.horizontalLine();
  		} else {
        // Get user emails and find the user by email
        _data.list('users', function(err, userIds) {
          if (!err && userIds && userIds.length > 0) {
            userIds.forEach(function(userId) {
              _data.read('users', userId, function(err, userData) {
                if (!err && userData) {
                  if (userData.email == userIdOrEmail) {
                    // Remove the hashed password
                    delete userData.hashedPassword;

                    // Print their JSON object with text highlighting
                    cli.header('USER ' + userId);
                    console.dir(userData,{'colors' : true});
                    cli.verticalSpace();
                    cli.horizontalLine();
                  }
                }
              });
            });
          }
        });
      }
  	});
	}
};


// Input processor
cli.processInput = function(str) {
	str = typeof(str) == 'string' && str.trim().length > 0 ? str.trim() : false;

	if (str) {
		// Codify the unique strings
		var uniqueInputs = [
			'man',
			'help',
			'exit',
			'stats',
      'menu',
      'list orders',
      'more order info',
			'list users',
			'more user info',
		];

		// Find the matching string
		var matchFound = false;
		var counter = 0;
		uniqueInputs.some(function(input){
			if (str.toLowerCase().indexOf(input) > -1) {
				matchFound = true;
				// Emit an event
				e.emit(input, str);
				return true;
			}
		});

		// If no match found tell the user to try again
		if (!matchFound) {
			console.log('Sorry, try again');
		}
	}
};

// Init script
cli.init = function() {
	// Send the start message in dark blue
	console.log('\x1b[34m%s\x1b[0m', 'The CLI is running');

	// Start the prompt
	var _interface = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
		prompt: ''
	});

	// Create an initial prompt
	_interface.prompt();

	// Handle each line of input separately
	_interface.on('line', function(str) {
		// Send to the input proccessor
		cli.processInput(str);

		// Reinit the prompt again
		_interface.prompt();
	});

	// If the user stops CLI, kill the assosiated process
	_interface.on('close', function() {
		process.exit(0);
	});
};

// Export the module
module.exports = cli;
