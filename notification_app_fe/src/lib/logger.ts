/**
 * Frontend Logger
 * 
 * Integrates the shared logging middleware for frontend use.
 * Configures the logger with frontend-specific settings and
 * provides a convenience wrapper that defaults to "frontend" stack.
 */

import axios from 'axios';

/** Valid log levels */
type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal';

/** Valid frontend packages */
type FrontendPackage = 'api' | 'component' | 'hook' | 'page' | 'state' | 'style' | 'auth' | 'config' | 'middleware' | 'utils';

/** Log payload structure */
interface LogPayload {
  stack: 'frontend' | 'backend';
  level: LogLevel;
  package: string;
  message: string;
}

const LOGGING_API_URL = process.env.NEXT_PUBLIC_LOGGING_API_URL || 'http://4.224.186.213/evaluation-service/logs';
const AUTH_TOKEN = process.env.NEXT_PUBLIC_AUTH_TOKEN || '';

/**
 * Sends a log to the remote logging API.
 * Never throws - all errors are swallowed to prevent app crashes.
 * Uses fire-and-forget pattern with retry logic.
 */
async function sendLog(payload: LogPayload, attempt: number = 1): Promise<void> {
  const MAX_RETRIES = 3;
  const TIMEOUT_MS = 5000;

  try {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (AUTH_TOKEN) {
      headers['Authorization'] = `Bearer ${AUTH_TOKEN}`;
    }
    await axios.post(LOGGING_API_URL, payload, {
      timeout: TIMEOUT_MS,
      headers
    });
  } catch (error) {
    if (attempt < MAX_RETRIES) {
      const backoff = Math.min(1000 * Math.pow(2, attempt - 1), 10000);
      await new Promise(resolve => setTimeout(resolve, backoff));
      return sendLog(payload, attempt + 1);
    }
    // Silently fail after all retries - never crash the app
    console.error(`[LOGGER] Failed after ${MAX_RETRIES} attempts:`, (error as Error).message);
  }
}

/**
 * Main logging function for the frontend.
 * 
 * @param stack - "frontend" or "backend"
 * @param level - Log severity level
 * @param pkg - Package identifier
 * @param message - Human-readable log message
 */
export function Log(
  stack: 'frontend' | 'backend',
  level: LogLevel,
  pkg: FrontendPackage,
  message: string
): void {
  try {
    const payload: LogPayload = { stack, level, package: pkg, message };

    // Console output with formatting
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${stack.toUpperCase()}] [${level.toUpperCase()}] [${pkg}]`;
    
    switch (level) {
      case 'debug':
        console.debug(`${prefix} ${message}`);
        break;
      case 'info':
        console.info(`${prefix} ${message}`);
        break;
      case 'warn':
        console.warn(`${prefix} ${message}`);
        break;
      case 'error':
      case 'fatal':
        console.error(`${prefix} ${message}`);
        break;
    }

    // Fire-and-forget API call
    void sendLog(payload);
  } catch {
    // Never crash the app due to logging
  }
}
