import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { ApiError } from '../utils/apiError.js';
import { env } from '../config/env.js';

export const errorHandler: ErrorRequestHandler = (
  err: any,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void => {
  let statusCode = 500;
  let message = 'Internal Server Error';
  let errors: unknown[] | undefined;

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    errors = err.errors;
  } else if (err.name === 'CastError') {
    // Mongoose CastError (e.g. invalid ObjectId)
    statusCode = 400;
    message = `Invalid format for '${err.path}': '${err.value}'`;
  } else if (err.code === 11000) {
    // MongoDB duplicate key error
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    const value = err.keyValue ? err.keyValue[field] : '';
    message = `Duplicate value '${value}' already exists for unique field '${field}'`;
  } else if (err.name === 'ValidationError') {
    // Mongoose schema validation error
    statusCode = 400;
    message = 'Validation failed';
    errors = Object.values(err.errors || {}).map((e: any) => ({
      field: e.path,
      message: e.message,
    }));
  } else if (err.name === 'ZodError') {
    // Zod validation error
    statusCode = 400;
    message = 'Invalid request parameters';
    errors = err.errors?.map((e: any) => ({
      field: e.path?.join('.'),
      message: e.message,
    }));
  } else {
    // Unhandled system exceptions
    console.error('💥 Unhandled Exception:', err);
  }

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    ...(errors ? { errors } : {}),
    ...(env.NODE_ENV === 'development' && err.stack ? { stack: err.stack } : {}),
  });
};
