import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { createComment, getCommentsByIssue } from '../controllers/comments.controller';

import { validateRequest } from '../middleware/validateRequest';
import { CreateCommentDto } from '../dtos/comment.dto';

const router = Router({ mergeParams: true });

/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: Issue comments
 */

// Apply authentication
router.use(authenticate);

/**
 * @swagger
 * /issues/{issueId}/comments:
 *   post:
 *     summary: Add a comment to an issue
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: issueId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Comment added successfully
 */
router.post('/', validateRequest(CreateCommentDto), createComment);

/**
 * @swagger
 * /issues/{issueId}/comments:
 *   get:
 *     summary: Get comments for an issue
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: issueId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of comments
 */
router.get('/', getCommentsByIssue);

export default router;
