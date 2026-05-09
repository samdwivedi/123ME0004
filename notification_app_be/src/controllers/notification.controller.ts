/**
 * Notification Controller
 * 
 * Handles HTTP request/response logic for notification endpoints.
 * Delegates business logic to the service layer.
 */

import { Request, Response, NextFunction } from 'express';
import { Log } from '../../../logging_middleware/src';
import { fetchNotifications, validateQueryParams } from '../services';
import { AppError } from '../middleware';
import { ApiResponse, HealthResponse } from '../types';

/**
 * GET /api/v1/notifications
 * 
 * Fetches notifications from the external API with
 * optional pagination and filtering.
 * 
 * Query Parameters:
 * - limit: number (1-100, default: 10)
 * - page: number (default: 1)
 * - notification_type: "Event" | "Result" | "Placement"
 */
export async function getNotifications(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    Log('backend', 'info', 'controller', `Processing GET /api/v1/notifications`);

    // Validate query parameters
    const validationError = validateQueryParams(req.query);
    if (validationError) {
      Log('backend', 'warn', 'controller', `Validation failed: ${validationError}`);
      throw new AppError(validationError, 400);
    }

    // Parse validated query params
    const params = {
      limit: req.query.limit ? Number(req.query.limit) : undefined,
      page: req.query.page ? Number(req.query.page) : undefined,
      notification_type: req.query.notification_type as string | undefined
    };

    Log('backend', 'debug', 'controller', `Query params: ${JSON.stringify(params)}`);

    // Fetch notifications from service layer
    const data = await fetchNotifications(params);

    // Build response
    const response: ApiResponse<any> = {
      success: true,
      data: data,
      metadata: {
        page: params.page || 1,
        limit: params.limit || 10,
        notification_type: params.notification_type
      }
    };

    Log('backend', 'info', 'controller', `Successfully returned notifications`);
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/v1/health
 * 
 * Returns the health status of the backend service.
 * Does not require authentication.
 */
export function getHealth(_req: Request, res: Response): void {
  Log('backend', 'info', 'controller', 'Health check requested');

  const health: HealthResponse = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0'
  };

  res.status(200).json({
    success: true,
    data: health
  });
}
