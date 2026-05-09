/**
 * Express Application Setup
 * 
 * Configures the Express application with all middleware,
 * routes, error handlers, and security settings.
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import { config } from './config';
import { swaggerSpec } from './config/swagger';
import { requestLogger, errorHandler, notFoundHandler } from './middleware';
import routes from './routes';
import { Log } from '../../logging_middleware/src';

const app = express();

// ── Security Middleware ──────────────────────────────────────────────
app.use(helmet());
Log('backend', 'info', 'config', 'Helmet security headers enabled');

// ── CORS Configuration ──────────────────────────────────────────────
app.use(cors({
  origin: config.allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
Log('backend', 'info', 'config', `CORS enabled for origins: ${config.allowedOrigins.join(', ')}`);

// ── Rate Limiting ───────────────────────────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Maximum 100 requests per window
  message: { success: false, error: 'Too many requests, please try again later' },
  standardHeaders: true,
  legacyHeaders: false
});
app.use(limiter);
Log('backend', 'info', 'config', 'Rate limiting configured: 100 requests per 15 minutes');

// ── Body Parsing ────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ── Request Logging ─────────────────────────────────────────────────
app.use(requestLogger);

// ── Swagger Documentation ───────────────────────────────────────────
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Notification API Documentation'
}));
Log('backend', 'info', 'route', 'Swagger documentation available at /api-docs');

// ── API Routes ──────────────────────────────────────────────────────
app.use('/api/v1', routes);

// ── 404 Handler ─────────────────────────────────────────────────────
app.use(notFoundHandler);

// ── Global Error Handler (must be last) ─────────────────────────────
app.use(errorHandler);

export default app;
