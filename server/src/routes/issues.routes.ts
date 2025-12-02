import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { upload } from '../middleware/upload';
import { createIssue, getMyIssues, getIssueById, getAllIssues, assignIssue, updateIssueStatus, getIssueHistory } from '../controllers/issues.controller';

import { validateRequest } from '../middleware/validateRequest';
import { CreateIssueDto, AssignIssueDto, UpdateStatusDto } from '../dtos/issue.dto';

const router = Router();

// Apply authentication to all issue routes
router.use(authenticate);

// POST /api/issues - Create a new issue (with multiple image upload)
// Note: Validation for multipart/form-data is tricky with class-validator directly on body. 
// We might need to manually validate or parse body first. For now, let's keep it simple or skip validation for file upload route if complex.
// Actually, req.body will contain text fields after multer.
router.post('/', upload.array('images', 5), validateRequest(CreateIssueDto), createIssue);

// GET /api/issues/all - Get all issues (Manager only)
router.get('/all', authorize('MANAGER'), getAllIssues);

// GET /api/issues - Get issues reported by the current user
router.get('/', getMyIssues);

// GET /api/issues/:id - Get specific issue details
router.get('/:id', getIssueById);

// GET /api/issues/:id/history - Get issue history
router.get('/:id/history', getIssueHistory);

// PATCH /api/issues/:id/assign - Assign issue (Manager only)
router.patch('/:id/assign', authorize('MANAGER'), validateRequest(AssignIssueDto), assignIssue);

// PATCH /api/issues/:id/status - Update status (Manager only)
router.patch('/:id/status', authorize('MANAGER'), validateRequest(UpdateStatusDto), updateIssueStatus);

export default router;
