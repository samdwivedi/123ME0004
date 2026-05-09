/**
 * API Routes
 * 
 * Defines all v1 API routes with authentication middleware.
 * Health route is public; notification routes are protected.
 */

import { Router } from 'express';
import { Log } from '../../../logging_middleware/src';
import { getNotifications, getHealth } from '../controllers';
import { authMiddleware } from '../middleware';

const router = Router();

/**
 * @swagger
 * /api/v1/health:
 *   get:
 *     summary: Health check endpoint
 *     description: Returns the current health status of the API
 *     responses:
 *       200:
 *         description: Service is healthy
 */
router.get('/health', getHealth);
Log('backend', 'info', 'route', 'Registered route: GET /api/v1/health');

/**
 * @swagger
 * /api/v1/notifications:
 *   get:
 *     summary: Get notifications
 *     description: Fetches notifications from external API with pagination and filtering
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *         description: Number of notifications per page
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Page number
 *       - in: query
 *         name: notification_type
 *         schema:
 *           type: string
 *           enum: [Event, Result, Placement]
 *         description: Filter by notification type
 *     responses:
 *       200:
 *         description: Notifications retrieved successfully
 *       400:
 *         description: Invalid query parameters
 *       401:
 *         description: Missing authorization token
 *       403:
 *         description: Invalid authorization token
 */
router.get('/notifications', authMiddleware, getNotifications);
Log('backend', 'info', 'route', 'Registered route: GET /api/v1/notifications (protected)');

export default router;
