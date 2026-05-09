/**
 * Backend Configuration Module
 * 
 * Centralizes all environment-based configuration.
 * Validates required environment variables on startup.
 * Uses dotenv for loading .env files.
 */

import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

/** Application configuration interface */
export interface AppConfig {
  /** Server port number */
  port: number;
  /** Current environment (development, production, test) */
  nodeEnv: string;
  /** External notification API base URL */
  notificationApiUrl: string;
  /** Logging API URL for the middleware */
  loggingApiUrl: string;
  /** Bearer token for API authentication */
  authToken: string;
  /** Comma-separated list of allowed CORS origins */
  allowedOrigins: string[];
}

/**
 * Builds and validates the application configuration
 * from environment variables.
 * 
 * @returns Validated AppConfig object
 */
function loadConfig(): AppConfig {
  const config: AppConfig = {
    port: parseInt(process.env.PORT || '5000', 10),
    nodeEnv: process.env.NODE_ENV || 'development',
    notificationApiUrl: process.env.NOTIFICATION_API_URL || 'http://4.224.186.213/evaluation-service/notifications',
    loggingApiUrl: process.env.LOGGING_API_URL || 'http://4.224.186.213/evaluation-service/logs',
    authToken: process.env.AUTH_TOKEN || 'secure_notification_token_2024',
    allowedOrigins: (process.env.ALLOWED_ORIGINS || 'http://localhost:3000').split(',').map(s => s.trim())
  };

  return config;
}

/** Singleton configuration instance */
export const config = loadConfig();
