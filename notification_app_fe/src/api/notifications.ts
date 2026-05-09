/**
 * Notification API Service
 * 
 * Abstraction layer for all notification-related API calls.
 * Provides clean, typed functions for the frontend to consume.
 */

import { apiClient } from './client';
import { Log } from '../lib/logger';
import { ApiResponse, Notification, NotificationParams, HealthResponse } from '../types';

/**
 * Fetches notifications with optional pagination and filtering.
 * 
 * @param params - Query parameters for filtering and pagination
 * @returns Promise resolving to the API response
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getNotifications(params: NotificationParams = {}): Promise<ApiResponse<any>> {
  try {
    Log('frontend', 'info', 'api', `Fetching notifications: ${JSON.stringify(params)}`);

    const queryParams: Record<string, string | number> = {};
    if (params.limit) queryParams.limit = params.limit;
    if (params.page) queryParams.page = params.page;
    if (params.notification_type) queryParams.notification_type = params.notification_type;

    const response = await apiClient.get('/notifications', { params: queryParams });
    
    Log('frontend', 'info', 'api', `Notifications fetched successfully`);
    return response.data;
  } catch (error) {
    Log('frontend', 'error', 'api', `Failed to fetch notifications: ${(error as Error).message}`);
    throw error;
  }
}

/**
 * Fetches the health status of the backend service.
 * 
 * @returns Promise resolving to the health response
 */
export async function getHealthStatus(): Promise<ApiResponse<HealthResponse>> {
  try {
    const response = await apiClient.get('/health');
    return response.data;
  } catch (error) {
    Log('frontend', 'error', 'api', `Health check failed: ${(error as Error).message}`);
    throw error;
  }
}
