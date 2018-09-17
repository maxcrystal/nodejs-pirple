/**
 * Primary file for the API.
 */

// Dependencies.
const server = require('./src/server');

// Declare the app.
const app = {};

// Init function.
app.init = () => {
  // Start the server.
  server.init();
};

// Execute.
app.init();

// Export the module.
module.exports = app;
