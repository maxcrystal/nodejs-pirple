/**
 * Menu request handlers.
 */

// Dependencies.
const getMenu = require('../usecases/menu/getMenu');
const RequestContainer = require('../models/ResponseContainer');

/**
 * Menu controller.
 * @param {RequestData} requestData
 * @return {Promise}
 */
userController = async (requestData) => {
  switch (requestData.method) {
    case 'get':
      return await getMenu(requestData);

    default:
      return new RequestContainer(405, {error: 'Method is not allowed'});
  }
};

// Export the module.
module.exports = userController;
