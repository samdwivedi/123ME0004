/**
 * Backend Type Definitions
 * 
 * Shared interfaces and types used across the backend application.
 */

/** Supported notification types for filtering */
export type NotificationType = 'Event' | 'Result' | 'Placement';

/** Query parameters for the notification API */
export interface NotificationQueryParams {
  /** Number of notifications per page */
  limit?: number;
  /** Page number for pagination */
  page?: number;
  /** Filter by notification type */
  notification_type?: NotificationType;
}

/** Single notification object from the external API */
export interface Notification {
  id: string | number;
  title: string;
  message: string;
  notification_type: NotificationType;
  priority?: string;
  timestamp?: string;
  [key: string]: unknown; // Allow additional fields from external API
}

/** Response from the external notification API */
export interface NotificationApiResponse {
  notifications: Notification[];
  total?: number;
  page?: number;
  limit?: number;
  [key: string]: unknown;
}

/** Standardized API response wrapper */
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

/** Health check response */
export interface HealthResponse {
  status: string;
  timestamp: string;
  uptime: number;
  environment: string;
  version: string;
}
