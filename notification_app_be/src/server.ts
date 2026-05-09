/**
 * Server Entry Point
 * 
 * Starts the Express server and sets up process-level
 * error handlers for uncaught exceptions and unhandled rejections.
 */

import app from './app';
import { config } from './config';
import { Log, configureLogger } from '../../logging_middleware/src';

// Configure the logging middleware with environment settings
configureLogger({
  apiUrl: config.loggingApiUrl,
  maxRetries: 3,
  timeoutMs: 5000,
  enableConsole: true,
  minLevel: 'debug',
  authToken: config.authToken
});

Log('backend', 'info', 'config', 'Logging middleware configured successfully');

// ── Start Server ────────────────────────────────────────────────────
const server = app.listen(config.port, () => {
  Log('backend', 'info', 'config', `🚀 Server started on port ${config.port}`);
  Log('backend', 'info', 'config', `📚 Swagger docs: http://localhost:${config.port}/api-docs`);
  Log('backend', 'info', 'config', `🏥 Health check: http://localhost:${config.port}/api/v1/health`);
  Log('backend', 'info', 'config', `🌍 Environment: ${config.nodeEnv}`);
});

// ── Graceful Shutdown ───────────────────────────────────────────────
function gracefulShutdown(signal: string): void {
  Log('backend', 'info', 'config', `${signal} received. Starting graceful shutdown...`);

  server.close(() => {
    Log('backend', 'info', 'config', 'Server closed. Process exiting.');
    process.exit(0);
  });

  // Force exit after 10 seconds if graceful shutdown fails
  setTimeout(() => {
    Log('backend', 'error', 'config', 'Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// ── Unhandled Exception Handlers ────────────────────────────────────
process.on('uncaughtException', (error: Error) => {
  Log('backend', 'fatal', 'handler', `Uncaught Exception: ${error.message} | Stack: ${error.stack?.substring(0, 300)}`);
  gracefulShutdown('UNCAUGHT_EXCEPTION');
});

process.on('unhandledRejection', (reason: unknown) => {
  const message = reason instanceof Error ? reason.message : String(reason);
  Log('backend', 'fatal', 'handler', `Unhandled Rejection: ${message}`);
});

export default server;
