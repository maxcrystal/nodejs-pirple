// Dependencies.
const validator = require('../services/validator');

/**
 * MenuItem class.
 */
class MenuItem {
  /**
   * Menu item constructor.
   * @param {number} id
   * @param {string} name
   * @param {number} price
   */
  constructor({id, name, price}) {
    this.id = validator.parsePositiveInteger(id);
    this.name = validator.parseString(name);
    this.price = validator.parsePositiveFloat(price);
    this.quantity = 1;
  }

  /**
   * Convert menu item to public object.
   * @return {object}
   */
  toObject() {
    return {
      id: this.id,
      name: this.name,
      price: this.price,
    };
  }
}

// Export the module.
module.exports = MenuItem;
