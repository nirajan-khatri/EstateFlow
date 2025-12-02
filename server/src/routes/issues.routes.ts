import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { upload } from '../middleware/upload';
import { createIssue, getMyIssues, getAssignedIssues, getIssueById, getAllIssues, assignIssue, updateIssueStatus, getIssueHistory } from '../controllers/issues.controller';

import { validateRequest } from '../middleware/validateRequest';
import { CreateIssueDto, AssignIssueDto, UpdateStatusDto } from '../dtos/issue.dto';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Issues
 *   description: Issue management endpoints
 */

// Apply authentication to all issue routes
router.use(authenticate);

/**
 * @swagger
 * /issues:
 *   post:
 *     summary: Create a new issue
 *     tags: [Issues]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               priority:
 *                 type: string
 *                 enum: [LOW, MEDIUM, HIGH, CRITICAL]
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Issue created successfully
 */
router.post('/', upload.array('images', 5), validateRequest(CreateIssueDto), createIssue);

/**
 * @swagger
 * /issues/all:
 *   get:
 *     summary: Get all issues (Manager only)
 *     tags: [Issues]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all issues
 *       403:
 *         description: Forbidden (Managers only)
 */
router.get('/all', authorize('MANAGER'), getAllIssues);

/**
 * @swagger
 * /issues:
 *   get:
 *     summary: Get issues reported by current user
 *     tags: [Issues]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of reported issues
 */
router.get('/', getMyIssues);

/**
 * @swagger
 * /issues/assigned:
 *   get:
 *     summary: Get issues assigned to current user
 *     tags: [Issues]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of assigned issues
 */
router.get('/assigned', getAssignedIssues);

/**
 * @swagger
 * /issues/{id}:
 *   get:
 *     summary: Get issue details
 *     tags: [Issues]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Issue details
 *       404:
 *         description: Issue not found
 */
router.get('/:id', getIssueById);

/**
 * @swagger
 * /issues/{id}/history:
 *   get:
 *     summary: Get issue history
 *     tags: [Issues]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Issue history
 */
router.get('/:id/history', getIssueHistory);

/**
 * @swagger
 * /issues/{id}/assign:
 *   patch:
 *     summary: Assign issue to an employee (Manager only)
 *     tags: [Issues]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               assigneeId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Issue assigned successfully
 *       403:
 *         description: Forbidden
 */
router.patch('/:id/assign', authorize('MANAGER'), validateRequest(AssignIssueDto), assignIssue);

/**
 * @swagger
 * /issues/{id}/status:
 *   patch:
 *     summary: Update issue status (Manager only)
 *     tags: [Issues]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [OPEN, IN_PROGRESS, RESOLVED, CLOSED]
 *     responses:
 *       200:
 *         description: Status updated successfully
 *       403:
 *         description: Forbidden
 */
router.patch('/:id/status', authorize('MANAGER'), validateRequest(UpdateStatusDto), updateIssueStatus);

export default router;
