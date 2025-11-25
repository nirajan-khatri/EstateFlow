import { Router } from 'express';
import { register, login, getEmployees } from '../controllers/auth.controller';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// POST /api/auth/register
router.post('/register', register);

// POST /api/auth/login
router.post('/login', login);

// GET /api/auth/employees
router.get('/employees', authenticate, authorize('MANAGER'), getEmployees);

export default router;
