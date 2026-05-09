/**
 * Authentication Middleware
 * 
 * Validates Bearer token in the Authorization header.
 * All API routes are protected and require valid authentication.
 */

import { Request, Response, NextFunction } from 'express';
import { config } from '../config';
import { Log } from '../../../logging_middleware/src';

/**
 * Express middleware that validates Bearer token authentication.
 * Returns 401 if no token is provided, 403 if token is invalid.
 */
export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  // Check if Authorization header exists
  if (!authHeader) {
    Log('backend', 'warn', 'auth', `Missing Authorization header for ${req.method} ${req.path}`);
    res.status(401).json({
      success: false,
      error: 'Authorization header is required'
    });
    return;
  }

  // Check if it follows Bearer token format
  if (!authHeader.startsWith('Bearer ')) {
    Log('backend', 'warn', 'auth', `Invalid Authorization format for ${req.method} ${req.path}`);
    res.status(401).json({
      success: false,
      error: 'Authorization header must use Bearer scheme'
    });
    return;
  }

  // Extract and validate the token
  const token = authHeader.substring(7); // Remove 'Bearer ' prefix

  if (token !== config.authToken) {
    Log('backend', 'error', 'auth', `Invalid token attempt for ${req.method} ${req.path}`);
    res.status(403).json({
      success: false,
      error: 'Invalid or expired token'
    });
    return;
  }

  // Token is valid, proceed to next middleware/handler
  Log('backend', 'debug', 'auth', `Token validated for ${req.method} ${req.path}`);
  next();
}
