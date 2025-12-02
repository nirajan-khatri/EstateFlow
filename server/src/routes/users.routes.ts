import { Router } from 'express';
import { getEmployees } from '../controllers/users.controller';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// Apply authentication to all user routes
router.use(authenticate);

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management endpoints
 */

/**
 * @swagger
 * /users/employees:
 *   get:
 *     summary: Get all employees (Manager only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of employees
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   email:
 *                     type: string
 *                   role:
 *                     type: string
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Managers only)
 */
router.get('/employees', authorize('MANAGER'), getEmployees);

export default router;
