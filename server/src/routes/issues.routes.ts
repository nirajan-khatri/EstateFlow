import { Router } from 'express';

const router = Router();

// POST /api/issues - Create new issue
router.post('/', (req, res) => {
    res.status(501).json({ message: 'Not implemented yet' });
});

// GET /api/issues - Get all issues (or user's issues)
router.get('/', (req, res) => {
    res.status(501).json({ message: 'Not implemented yet' });
});

// GET /api/issues/:id - Get single issue
router.get('/:id', (req, res) => {
    res.status(501).json({ message: 'Not implemented yet' });
});

// PATCH /api/issues/:id - Update issue
router.patch('/:id', (req, res) => {
    res.status(501).json({ message: 'Not implemented yet' });
});

// PATCH /api/issues/:id/assign - Assign issue
router.patch('/:id/assign', (req, res) => {
    res.status(501).json({ message: 'Not implemented yet' });
});

export default router;
