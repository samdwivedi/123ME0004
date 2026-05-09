/**
 * Logging Middleware - Core Logger
 * 
 * The main logging module that provides the `Log` function.
 * Handles validation, retry logic, timeout management,
 * and graceful failure handling. Never crashes the app
 * if the logging API is unreachable.
 */

import axios, { AxiosError } from 'axios';
import {
  LogStack,
  LogLevel,
  LogPackage,
  LogPayload,
  LoggerConfig,
  LOG_LEVEL_SEVERITY
} from './types';
import { validateLogParams } from './validator';

/** Default configuration values */
const DEFAULT_CONFIG: LoggerConfig = {
  apiUrl: process.env.LOGGING_API_URL || 'http://4.224.186.213/evaluation-service/logs',
  maxRetries: 3,
  timeoutMs: 5000,
  enableConsole: true,
  minLevel: 'debug',
  authToken: process.env.AUTH_TOKEN || process.env.NEXT_PUBLIC_AUTH_TOKEN || ''
};

/** Current logger configuration (mutable for runtime updates) */
let currentConfig: LoggerConfig = { ...DEFAULT_CONFIG };

/**
 * Configures the logger with custom settings.
 * Merges provided options with defaults, allowing partial overrides.
 * 
 * @param config - Partial configuration to merge with defaults
 */
export function configureLogger(config: Partial<LoggerConfig>): void {
  currentConfig = { ...currentConfig, ...config };
}

/**
 * Returns the current logger configuration.
 * Useful for debugging or testing purposes.
 */
export function getLoggerConfig(): LoggerConfig {
  return { ...currentConfig };
}

/**
 * Determines if a log should be processed based on its level
 * and the configured minimum level threshold.
 * 
 * @param level - The log level to check
 * @returns true if the log should be processed
 */
function shouldLog(level: LogLevel): boolean {
  return LOG_LEVEL_SEVERITY[level] >= LOG_LEVEL_SEVERITY[currentConfig.minLevel];
}

/**
 * Outputs a log entry to the console with appropriate formatting.
 * Uses different console methods based on the log level.
 * 
 * @param payload - The log payload to output
 */
function consoleOutput(payload: LogPayload): void {
  const timestamp = new Date().toISOString();
  const prefix = `[${timestamp}] [${payload.stack.toUpperCase()}] [${payload.level.toUpperCase()}] [${payload.package}]`;
  const fullMessage = `${prefix} ${payload.message}`;

  switch (payload.level) {
    case 'debug':
      console.debug(fullMessage);
      break;
    case 'info':
      console.info(fullMessage);
      break;
    case 'warn':
      console.warn(fullMessage);
      break;
    case 'error':
    case 'fatal':
      console.error(fullMessage);
      break;
    default:
      console.log(fullMessage);
  }
}

/**
 * Sends a log entry to the remote logging API with retry logic.
 * Implements exponential backoff between retries.
 * Never throws - all errors are handled gracefully.
 * 
 * @param payload - The validated log payload to send
 * @param attempt - Current retry attempt number (internal use)
 */
async function sendToApi(payload: LogPayload, attempt: number = 1): Promise<void> {
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    if (currentConfig.authToken) {
      headers['Authorization'] = `Bearer ${currentConfig.authToken}`;
    }
    await axios.post(currentConfig.apiUrl, payload, {
      timeout: currentConfig.timeoutMs,
      headers
    });
  } catch (error) {
    const axiosError = error as AxiosError;
    const errorMessage = axiosError.message || 'Unknown error';

    // Retry with exponential backoff if attempts remain
    if (attempt < currentConfig.maxRetries) {
      const backoffMs = Math.min(1000 * Math.pow(2, attempt - 1), 10000);

      if (currentConfig.enableConsole) {
        console.warn(
          `[LOGGER] Failed to send log (attempt ${attempt}/${currentConfig.maxRetries}): ${errorMessage}. ` +
          `Retrying in ${backoffMs}ms...`
        );
      }

      // Wait for backoff period then retry
      await new Promise(resolve => setTimeout(resolve, backoffMs));
      return sendToApi(payload, attempt + 1);
    }

    // All retries exhausted - log failure to console but never crash
    if (currentConfig.enableConsole) {
      console.error(
        `[LOGGER] Failed to send log after ${currentConfig.maxRetries} attempts: ${errorMessage}. ` +
        `Original log: [${payload.stack}/${payload.level}/${payload.package}] ${payload.message}`
      );
    }
  }
}

/**
 * Main logging function - the primary export of this middleware.
 * 
 * Validates all parameters, optionally outputs to console,
 * and sends the log entry to the remote logging API.
 * 
 * This function is fire-and-forget: it returns immediately
 * and processes the API call asynchronously. It will NEVER
 * throw an error or crash the application.
 * 
 * @param stack - The application stack ("backend" | "frontend")
 * @param level - The log severity level ("debug" | "info" | "warn" | "error" | "fatal")
 * @param pkg - The package/module identifier (e.g., "handler", "api", "middleware")
 * @param message - The human-readable log message
 * 
 * @example
 * ```typescript
 * Log('backend', 'info', 'handler', 'Request received for /api/v1/notifications');
 * Log('frontend', 'error', 'api', 'Failed to fetch notifications: timeout');
 * ```
 */
export function Log(
  stack: LogStack,
  level: LogLevel,
  pkg: LogPackage,
  message: string
): void {
  try {
    // Validate all parameters before processing
    const validation = validateLogParams(stack, level, pkg, message);
    if (!validation.isValid) {
      if (currentConfig.enableConsole) {
        console.error(`[LOGGER] Validation failed: ${validation.error}`);
      }
      return;
    }

    // Check if this log level meets the minimum threshold
    if (!shouldLog(level)) {
      return;
    }

    // Construct the log payload
    const payload: LogPayload = {
      stack,
      level,
      package: pkg,
      message
    };

    // Output to console if enabled
    if (currentConfig.enableConsole) {
      consoleOutput(payload);
    }

    // Send to API asynchronously (fire-and-forget)
    // The void operator explicitly marks this as intentionally not awaited
    void sendToApi(payload);
  } catch (error) {
    // Absolute last resort - never let the logger crash the app
    if (currentConfig.enableConsole) {
      console.error('[LOGGER] Unexpected error in Log function:', error);
    }
  }
}
