/**
 * Standard API response wrapper
 * Ensures consistent response format across all endpoints
 */
class ApiResponse {
  /**
   * @param {number} statusCode - HTTP status code
   * @param {string} message - Response message
   * @param {*} data - Response data payload
   * @param {Object} [pagination] - Pagination metadata
   */
  constructor(statusCode, message, data = null, pagination = null) {
    this.success = statusCode < 400;
    this.message = message;
    this.data = data;
    if (pagination) {
      this.pagination = pagination;
    }
  }

  /**
   * Send the response
   * @param {import('express').Response} res - Express response object
   * @returns {import('express').Response}
   */
  send(res) {
    return res.status(this.statusCode || 200).json(this);
  }

  /**
   * Create a success response
   * @param {string} message
   * @param {*} data
   * @param {Object} [pagination]
   * @returns {Object}
   */
  static success(message, data = null, pagination = null) {
    const response = {
      success: true,
      message,
      data,
    };
    if (pagination) response.pagination = pagination;
    return response;
  }

  /**
   * Create an error response
   * @param {string} message
   * @param {Array} [errors]
   * @returns {Object}
   */
  static error(message, errors = []) {
    return {
      success: false,
      message,
      errors,
    };
  }
}

export default ApiResponse;
