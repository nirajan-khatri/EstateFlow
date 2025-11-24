import { Router } from 'express';

const router = Router();

// POST /api/auth/register
router.post('/register', (req, res) => {
    res.status(501).json({ message: 'Not implemented yet' });
});

// POST /api/auth/login
router.post('/login', (req, res) => {
    res.status(501).json({ message: 'Not implemented yet' });
});

export default router;
