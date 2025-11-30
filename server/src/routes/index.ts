import { Router } from 'express';
import authRoutes from './auth.routes';
import issuesRoutes from './issues.routes';
import dashboardRoutes from './dashboard.routes';

import commentsRoutes from './comments.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/issues', issuesRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/issues/:issueId/comments', commentsRoutes);

export default router;
