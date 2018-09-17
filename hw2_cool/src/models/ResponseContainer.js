/**
 * ResponseContainer class that is used as container for API response data.
 */
class ResponseContainer {
  /**
   * Response constructor.
   * @param {number} statusCode
   * @param {object} payload
   */
  constructor(statusCode = 200, payload = {}) {
    this.statusCode = statusCode;
    this.payload = payload;
    // Convert the payload to a string.
    this.payloadString = JSON.stringify(payload)
  }
}

// Export the module.
module.exports = ResponseContainer;
