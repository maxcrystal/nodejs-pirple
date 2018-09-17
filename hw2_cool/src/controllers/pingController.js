/**
 * Ping request handler.
 */

// Dependencies.
const RequestContainer = require('../models/ResponseContainer');

/**
 * Ping controller.
 * @param {RequestData} requestData
 * @return {Promise}
 */
const pingController = async (requestData) => {
  return new RequestContainer(200);
};

// Export the module.
module.exports = pingController;
