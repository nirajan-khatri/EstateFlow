import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { upload } from '../middleware/upload';
import { createIssue, getMyIssues, getIssueById, getAllIssues, assignIssue, updateIssueStatus } from '../controllers/issues.controller';

const router = Router();

// Apply authentication to all issue routes
router.use(authenticate);

// POST /api/issues - Create a new issue (with image upload)
router.post('/', upload.single('image'), createIssue);

// GET /api/issues/all - Get all issues (Manager only)
router.get('/all', authorize('MANAGER'), getAllIssues);

// GET /api/issues - Get issues reported by the current user
router.get('/', getMyIssues);

// GET /api/issues/:id - Get specific issue details
router.get('/:id', getIssueById);

// PATCH /api/issues/:id/assign - Assign issue (Manager only)
router.patch('/:id/assign', authorize('MANAGER'), assignIssue);

// PATCH /api/issues/:id/status - Update status (Manager only)
router.patch('/:id/status', authorize('MANAGER'), updateIssueStatus);

export default router;
