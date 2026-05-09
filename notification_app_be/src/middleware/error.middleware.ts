/**
 * Error Handling Middleware
 * 
 * Centralized error handler for the Express application.
 * Catches all unhandled errors and returns structured responses.
 * Logs all errors through the logging middleware.
 */

import { Request, Response, NextFunction } from 'express';
import { Log } from '../../../logging_middleware/src';

/** Custom application error with status code */
export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Express error handling middleware.
 * Must be registered AFTER all routes.
 * Handles both operational errors and unexpected exceptions.
 */
export function errorHandler(
  err: Error | AppError,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  const statusCode = (err as AppError).statusCode || 500;
  const message = err.message || 'Internal Server Error';

  // Log the error with appropriate severity
  if (statusCode >= 500) {
    Log('backend', 'error', 'handler', `Server Error: ${message} | Path: ${req.path} | Stack: ${err.stack?.substring(0, 200)}`);
  } else {
    Log('backend', 'warn', 'handler', `Client Error: ${message} | Path: ${req.path}`);
  }

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
}

/**
 * 404 Not Found handler.
 * Catches requests to undefined routes.
 */
export function notFoundHandler(req: Request, res: Response): void {
  Log('backend', 'warn', 'route', `Route not found: ${req.method} ${req.path}`);

  res.status(404).json({
    success: false,
    error: `Route ${req.method} ${req.path} not found`
  });
}
