/**
 * NotFound request handler.
 */

// Dependencies.
const RequestContainer = require('../models/ResponseContainer');

/**
 * Not found controller.
 * @param {RequestData} requestData
 * @return {Promise}
 */
const notFoundController = async (requestData) => {
  return new RequestContainer(404);
};

// Export the module.
module.exports = notFoundController;
