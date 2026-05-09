/**
 * Notification Service
 * 
 * Handles all business logic for fetching notifications
 * from the external API. Implements request validation,
 * pagination, filtering, and latency tracking.
 */

import axios, { AxiosError } from 'axios';
import { config } from '../config';
import { Log } from '../../../logging_middleware/src';
import {
  NotificationQueryParams,
  NotificationApiResponse,
  NotificationType
} from '../types';

/** Valid notification types for validation */
const VALID_NOTIFICATION_TYPES: NotificationType[] = ['Event', 'Result', 'Placement'];

/**
 * Validates query parameters for notification requests.
 * Returns an error message string if validation fails, null if valid.
 * 
 * @param params - Query parameters to validate
 * @returns Error message or null
 */
export function validateQueryParams(params: Record<string, any>): string | null {
  const { limit, page, notification_type } = params;

  // Validate limit (must be positive integer if provided)
  if (limit !== undefined) {
    const limitNum = Number(limit);
    if (isNaN(limitNum) || limitNum < 1 || !Number.isInteger(limitNum)) {
      Log('backend', 'warn', 'service', `Validation error: invalid limit "${limit}"`);
      return 'limit must be a positive integer';
    }
    if (limitNum > 100) {
      Log('backend', 'warn', 'service', `Validation error: limit ${limit} exceeds maximum of 100`);
      return 'limit must not exceed 100';
    }
  }

  // Validate page (must be positive integer if provided)
  if (page !== undefined) {
    const pageNum = Number(page);
    if (isNaN(pageNum) || pageNum < 1 || !Number.isInteger(pageNum)) {
      Log('backend', 'warn', 'service', `Validation error: invalid page "${page}"`);
      return 'page must be a positive integer';
    }
  }

  // Validate notification_type (must be one of the allowed values)
  if (notification_type !== undefined) {
    if (!VALID_NOTIFICATION_TYPES.includes(notification_type as NotificationType)) {
      Log('backend', 'warn', 'service', `Validation error: invalid notification_type "${notification_type}"`);
      return `notification_type must be one of: ${VALID_NOTIFICATION_TYPES.join(', ')}`;
    }
  }

  return null;
}

/**
 * Fetches notifications from the external API with
 * pagination and filtering support. Tracks API latency
 * and handles errors gracefully.
 * 
 * @param params - Validated query parameters
 * @returns API response data
 * @throws AppError on API failure
 */
export async function fetchNotifications(
  params: NotificationQueryParams
): Promise<NotificationApiResponse> {
  const startTime = Date.now();

  // Build query parameters for external API
  const queryParams: Record<string, string | number> = {};

  if (params.limit) {
    queryParams.limit = params.limit;
    Log('backend', 'info', 'service', `Pagination: limit=${params.limit}`);
  }

  if (params.page) {
    queryParams.page = params.page;
    Log('backend', 'info', 'service', `Pagination: page=${params.page}`);
  }

  if (params.notification_type) {
    queryParams.notification_type = params.notification_type;
    Log('backend', 'info', 'service', `Filtering: notification_type=${params.notification_type}`);
  }

  try {
    Log('backend', 'info', 'service', `Fetching notifications from external API: ${config.notificationApiUrl}`);

    const response = await axios.get(config.notificationApiUrl, {
      params: queryParams,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.authToken}`
      }
    });

    const latency = Date.now() - startTime;
    Log('backend', 'info', 'service', `External API responded successfully in ${latency}ms`);

    // Track API latency for monitoring
    if (latency > 5000) {
      Log('backend', 'warn', 'service', `External API latency exceeded 5s: ${latency}ms`);
    }

    return response.data;
  } catch (error) {
    const latency = Date.now() - startTime;
    const axiosError = error as AxiosError;

    Log('backend', 'error', 'service',
      `External API request failed after ${latency}ms: ${axiosError.message} | ` +
      `Status: ${axiosError.response?.status || 'N/A'} | ` +
      `URL: ${config.notificationApiUrl}`
    );

    // Re-throw with meaningful error message
    throw new Error(
      `Failed to fetch notifications from external API: ${axiosError.message}`
    );
  }
}
