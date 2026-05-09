/**
 * Frontend Type Definitions
 * 
 * Shared interfaces and types used across the frontend application.
 */

/** Supported notification types */
export type NotificationType = 'Event' | 'Result' | 'Placement';

/** Single notification object */
export interface Notification {
  id: string | number;
  title: string;
  message: string;
  notification_type: NotificationType;
  priority?: string;
  timestamp?: string;
  [key: string]: unknown;
}

/** API response wrapper */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  metadata?: {
    page?: number;
    limit?: number;
    total?: number;
    notification_type?: string;
  };
}

/** Query parameters for notifications */
export interface NotificationParams {
  limit?: number;
  page?: number;
  notification_type?: NotificationType | '';
}

/** Health check response */
export interface HealthResponse {
  status: string;
  timestamp: string;
  uptime: number;
  environment: string;
  version: string;
}

/** Viewed state for notification tracking */
export interface ViewedState {
  [notificationId: string]: boolean;
}
