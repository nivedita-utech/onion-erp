import { ZodError } from 'zod';
import ApiError from '../utils/ApiError.js';

/**
 * Express middleware to validate request data against a Zod schema
 * @param {import('zod').AnyZodObject} schema 
 * @returns {import('express').RequestHandler}
 */
export const validate = (schema) => async (req, res, next) => {
  try {
    const validatedData = await schema.parseAsync({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    
    // Replace merged attributes with the stripped/validated versions
    req.body = validatedData.body;
    req.query = validatedData.query;
    req.params = validatedData.params;
    
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      // Map Zod errors to a readable format
      const errors = error.errors.map((err) => ({
        path: err.path.join('.'),
        message: err.message,
      }));
      return next(new ApiError(400, 'Validation Error', errors));
    }
    next(error);
  }
};
