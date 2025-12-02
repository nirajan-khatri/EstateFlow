import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { createComment, getCommentsByIssue } from '../controllers/comments.controller';

import { validateRequest } from '../middleware/validateRequest';
import { CreateCommentDto } from '../dtos/comment.dto';

const router = Router({ mergeParams: true });

// Apply authentication
router.use(authenticate);

// POST /api/issues/:issueId/comments
router.post('/', validateRequest(CreateCommentDto), createComment);

// GET /api/issues/:issueId/comments
router.get('/', getCommentsByIssue);

export default router;
