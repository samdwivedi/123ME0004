/**
 * Logging Middleware - Type Definitions
 * 
 * Contains all type definitions, enums, and interfaces
 * used throughout the logging middleware package.
 */

/** Valid stack values for log entries */
export type LogStack = 'backend' | 'frontend';

/** Valid log level values ordered by severity */
export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal';

/** Valid backend package identifiers */
export type BackendPackage =
  | 'cache'
  | 'controller'
  | 'cron_job'
  | 'db'
  | 'domain'
  | 'handler'
  | 'repository'
  | 'route'
  | 'service';

/** Valid frontend package identifiers */
export type FrontendPackage =
  | 'api'
  | 'component'
  | 'hook'
  | 'page'
  | 'state'
  | 'style';

/** Valid common package identifiers (used in both stacks) */
export type CommonPackage =
  | 'auth'
  | 'config'
  | 'middleware'
  | 'utils';

/** Combined type for all valid package values */
export type LogPackage = BackendPackage | FrontendPackage | CommonPackage;

/** Shape of the log payload sent to the logging API */
export interface LogPayload {
  stack: LogStack;
  level: LogLevel;
  package: LogPackage;
  message: string;
}

/** Configuration options for the logging middleware */
export interface LoggerConfig {
  /** Base URL for the logging API endpoint */
  apiUrl: string;
  /** Maximum number of retry attempts on failure */
  maxRetries: number;
  /** Request timeout in milliseconds */
  timeoutMs: number;
  /** Whether to output logs to console as well */
  enableConsole: boolean;
  /** Minimum log level to process (logs below this level are ignored) */
  minLevel: LogLevel;
  /** Bearer token for authenticating with the logging API */
  authToken: string;
}

/** All valid stack values for runtime validation */
export const VALID_STACKS: LogStack[] = ['backend', 'frontend'];

/** All valid log levels for runtime validation */
export const VALID_LEVELS: LogLevel[] = ['debug', 'info', 'warn', 'error', 'fatal'];

/** All valid backend packages for runtime validation */
export const VALID_BACKEND_PACKAGES: BackendPackage[] = [
  'cache', 'controller', 'cron_job', 'db', 'domain',
  'handler', 'repository', 'route', 'service'
];

/** All valid frontend packages for runtime validation */
export const VALID_FRONTEND_PACKAGES: FrontendPackage[] = [
  'api', 'component', 'hook', 'page', 'state', 'style'
];

/** All valid common packages for runtime validation */
export const VALID_COMMON_PACKAGES: CommonPackage[] = [
  'auth', 'config', 'middleware', 'utils'
];

/** Combined list of all valid packages for runtime validation */
export const VALID_PACKAGES: LogPackage[] = [
  ...VALID_BACKEND_PACKAGES,
  ...VALID_FRONTEND_PACKAGES,
  ...VALID_COMMON_PACKAGES
];

/** Numeric severity mapping for log level comparison */
export const LOG_LEVEL_SEVERITY: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
  fatal: 4
};
