import { Router } from 'express';
import { register, login, getEmployees } from '../controllers/auth.controller';
import { authenticate, authorize } from '../middleware/auth';

import { validateRequest } from '../middleware/validateRequest';
import { RegisterDto, LoginDto } from '../dtos/auth.dto';

const router = Router();

// POST /api/auth/register
router.post('/register', validateRequest(RegisterDto), register);

// POST /api/auth/login
router.post('/login', validateRequest(LoginDto), login);

// GET /api/auth/employees
router.get('/employees', authenticate, authorize('MANAGER'), getEmployees);

export default router;
