/**
 * Module that configures available routes in a system.
 */

// Dependencies.
const pingController = require('./controllers/pingController');
const notFoundController = require('./controllers/notFoundController');
const tokenController = require('./controllers/tokenController');
const userController = require('./controllers/userController');
const menuController = require('./controllers/menuController');
const cartController = require('./controllers/cartController');
const orderController = require('./controllers/orderController');

// Create module container.
const router = {};

// Map path to the specific request handler (controller).
router.routes = {
  ping: pingController,
  users: userController,
  tokens: tokenController,
  menus: menuController,
  carts: cartController,
  orders: orderController,
};

// Define notFound (404) controller.
router.notFound = notFoundController;

// Export the module.
module.exports = router;
