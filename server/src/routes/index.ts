import { Router } from 'express';
import authRoutes from './auth.routes';
import issuesRoutes from './issues.routes';
import dashboardRoutes from './dashboard.routes';

import commentsRoutes from './comments.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/dashboard', dashboardRoutes);

// Specific routes first
router.use('/issues/:issueId/comments', (req, res, next) => {
    console.log('Request to /issues/:issueId/comments', req.method, req.url);
    next();
}, commentsRoutes);

router.use('/issues', (req, res, next) => {
    console.log('Request to /issues', req.method, req.url);
    next();
}, issuesRoutes);

export default router;
