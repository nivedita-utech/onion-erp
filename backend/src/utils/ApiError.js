/**
 * Custom API error class
 * Extends Error to include status code and validation errors
 */
class ApiError extends Error {
  /**
   * @param {number} statusCode - HTTP status code
   * @param {string} message - Error message
   * @param {Array} [errors] - Validation errors array
   * @param {boolean} [isOperational] - Whether error is operational
   */
  constructor(statusCode, message, errors = [], isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.isOperational = isOperational;
    this.success = false;

    Error.captureStackTrace(this, this.constructor);
  }

  /**
   * Create a 400 Bad Request error
   * @param {string} message
   * @param {Array} [errors]
   * @returns {ApiError}
   */
  static badRequest(message = 'Bad Request', errors = []) {
    return new ApiError(400, message, errors);
  }

  /**
   * Create a 401 Unauthorized error
   * @param {string} message
   * @returns {ApiError}
   */
  static unauthorized(message = 'Unauthorized') {
    return new ApiError(401, message);
  }

  /**
   * Create a 403 Forbidden error
   * @param {string} message
   * @returns {ApiError}
   */
  static forbidden(message = 'Forbidden') {
    return new ApiError(403, message);
  }

  /**
   * Create a 404 Not Found error
   * @param {string} message
   * @returns {ApiError}
   */
  static notFound(message = 'Resource not found') {
    return new ApiError(404, message);
  }

  /**
   * Create a 500 Internal Server Error
   * @param {string} message
   * @returns {ApiError}
   */
  static internal(message = 'Internal Server Error') {
    return new ApiError(500, message, [], false);
  }
}

export default ApiError;
