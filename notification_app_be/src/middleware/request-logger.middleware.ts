/**
 * Request Logging Middleware
 * 
 * Logs all incoming HTTP requests with method, path, query params,
 * and response time. Provides observability for the backend API.
 */

import { Request, Response, NextFunction } from 'express';
import { Log } from '../../../logging_middleware/src';

/**
 * Express middleware that logs every incoming request
 * and measures response time for latency tracking.
 */
export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const startTime = Date.now();
  const { method, path, query } = req;

  // Log incoming request with query parameters
  const queryString = Object.keys(query).length > 0
    ? ` | Query: ${JSON.stringify(query)}`
    : '';

  Log('backend', 'info', 'middleware', `Incoming ${method} ${path}${queryString}`);

  // Override res.end to capture response time and status
  const originalEnd = res.end;
  res.end = function (this: Response, ...args: any[]): Response {
    const duration = Date.now() - startTime;
    const statusCode = res.statusCode;

    // Log based on status code
    if (statusCode >= 500) {
      Log('backend', 'error', 'middleware', `${method} ${path} → ${statusCode} (${duration}ms)`);
    } else if (statusCode >= 400) {
      Log('backend', 'warn', 'middleware', `${method} ${path} → ${statusCode} (${duration}ms)`);
    } else {
      Log('backend', 'info', 'middleware', `${method} ${path} → ${statusCode} (${duration}ms)`);
    }

    return originalEnd.apply(this, args as any);
  } as any;

  next();
}
