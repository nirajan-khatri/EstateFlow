import { Router } from 'express';

const router = Router();

// GET /api/dashboard/stats - Get dashboard statistics
router.get('/stats', (req, res) => {
    res.status(501).json({ message: 'Not implemented yet' });
});

export default router;
