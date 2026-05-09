/**
 * Logging Middleware - Package Entry Point
 * 
 * Re-exports all public APIs from the logging middleware.
 * Consumers import from this entry point:
 * 
 * @example
 * ```typescript
 * import { Log, configureLogger } from '../logging_middleware/src';
 * ```
 */

// Core logging function and configuration
export { Log, configureLogger, getLoggerConfig } from './logger';

// Type definitions for consumers
export type {
  LogStack,
  LogLevel,
  LogPackage,
  BackendPackage,
  FrontendPackage,
  CommonPackage,
  LogPayload,
  LoggerConfig
} from './types';

// Validation constants for consumers who need runtime checks
export {
  VALID_STACKS,
  VALID_LEVELS,
  VALID_BACKEND_PACKAGES,
  VALID_FRONTEND_PACKAGES,
  VALID_COMMON_PACKAGES,
  VALID_PACKAGES,
  LOG_LEVEL_SEVERITY
} from './types';

// Validation utilities
export { validateLogParams } from './validator';
