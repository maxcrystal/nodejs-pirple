/**
 * Server-related tasks.
 */

// Dependencies.
const http = require('http');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const util = require('util');
const config = require('./config');
const router = require('./router');
const jsonStringToObject = require('./services/jsonStringToObject');
const RequestData = require('./models/RequestData');
const ResponseContainer = require('./models/ResponseContainer');

// Configure server debugger.
const debug = util.debuglog('server');

// Instantiate the server module object.
const server = {};

// All the server logic for both HTTP and HTTPS servers.
server.unifiedServer = (request, response) => {
  // Get the URL and parse it.
  const parsedUrl = url.parse(request.url, true);

  // Get the path.
  const path = parsedUrl.pathname.toLocaleLowerCase();
  const trimmedPath = path.replace(/^\/+|\/+$/g, '');

  // Get the query string as an object.
  const queryStringObject = parsedUrl.query;

  // Get HTTP method.
  const method = request.method.toLocaleLowerCase();

  // Get the headers as an object.
  const headers = request.headers;

  // Get the payload, if any.
  const decoder = new StringDecoder('utf-8');
  let payload = '';

  request.on('data', (data) => {
    payload += decoder.write(data);
  });

  request.on('end', () => {
    payload += decoder.end();

    // Parse payload to object.
    payload = jsonStringToObject(payload);

    // Choose the controller this request should go to.
    // If one is not found use the notFound controller.
    const chosenController = router.routes[trimmedPath] ? router.routes[trimmedPath] : router.notFound;

    // Construct the data object to send to the handler.
    const requestData = new RequestData({
      trimmedPath,
      queryStringObject,
      method,
      headers,
      payload,
    });

    // Route the request to the handler (controller) specified in the router.
    chosenController(requestData)
      /** @var {ResponseContainer} responseContainer */
      .then((responseContainer) => {
        // Return the response.
        response.setHeader('Content-Type', 'application/json');
        response.writeHead(responseContainer.statusCode);
        response.end(responseContainer.payloadString);

        // If the response is 200 print green otherwise print red.
        if (responseContainer.statusCode === 200) {
          debug('\x1b[32m%s\x1b[0m', `${method.toUpperCase()} /${trimmedPath} ${responseContainer.statusCode}`);
        } else {
          debug('\x1b[31m%s\x1b[0m', `${method.toUpperCase()} /${trimmedPath} ${responseContainer.statusCode}`);
        }
      })
      .catch((error) => {
        // Create error response object.
        const responseContainer = new ResponseContainer(500, {error: 'Request can not be served'});

        // Return error response.
        response.setHeader('Content-Type', 'application/json');
        response.writeHead(responseContainer.statusCode);
        response.end(responseContainer.payloadString);

        debug('\x1b[31m%s\x1b[0m', `${method.toUpperCase()} /${trimmedPath} ${responseContainer.statusCode}`);
        // Debug error message to console.
        debug('\x1b[31m%s\x1b[0m', error.message);
      });
  });
};

// Instantiate the HTTP server.
server.httpServer = http.createServer((request, response) => {
  server.unifiedServer(request, response);
});

// Init script.
server.init = () => {
  // Start the HTTP server.
  server.httpServer.listen(config.httpPort, () => {
    console.log('\x1b[36m%s\x1b[0m', `The server is listening on port ${config.httpPort}`);
  });
};

// Export the module.
module.exports = server;
