import ApiError from '../utils/ApiError.js';

/**
 * Global error handling middleware
 * Catches all errors and returns a consistent response format
 */
const errorHandler = (err, _req, res, _next) => {
  let error = { ...err };
  error.message = err.message;
  error.stack = err.stack;

  // Log error for debugging
  if (process.env.NODE_ENV === 'development') {
    console.error('❌ Error:', err);
  }

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = new ApiError(404, message);
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `Duplicate value entered for ${field}`;
    error = new ApiError(400, message);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e) => e.message);
    const message = 'Validation Error';
    error = new ApiError(400, message, errors);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = new ApiError(401, 'Invalid token');
  }

  if (err.name === 'TokenExpiredError') {
    error = new ApiError(401, 'Token expired');
  }

  // Zod validation error
  if (err.name === 'ZodError') {
    const errors = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
    error = new ApiError(400, 'Validation Error', errors);
  }

  const statusCode = error.statusCode || 500;
  const response = {
    success: false,
    message: error.message || 'Internal Server Error',
  };

  if (error.errors && error.errors.length > 0) {
    response.errors = error.errors;
  }

  if (process.env.NODE_ENV === 'development') {
    response.stack = error.stack;
  }

  res.status(statusCode).json(response);
};

export default errorHandler;
