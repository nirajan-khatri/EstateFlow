import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { tryCatch } from '../utils/tryCatch';
import { AppError } from '../utils/AppError';

export const register = tryCatch(async (req: Request, res: Response) => {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
        throw new AppError('Please provide email, password and name', 400);
    }

    try {
        const result = await AuthService.register(req.body);
        res.status(201).json({
            message: 'User registered successfully',
            ...result,
            user: {
                id: result.user.id,
                email: result.user.email,
                name: result.user.name,
                role: result.user.role
            }
        });
    } catch (error: any) {
        if (error.message === 'User already exists') {
            throw new AppError(error.message, 400);
        }
        throw error;
    }
});

export const login = tryCatch(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new AppError('Please provide email and password', 400);
    }

    try {
        const result = await AuthService.login(req.body);
        res.json({
            message: 'Login successful',
            ...result,
            user: {
                id: result.user.id,
                email: result.user.email,
                name: result.user.name,
                role: result.user.role
            }
        });
    } catch (error: any) {
        if (error.message === 'Invalid credentials') {
            throw new AppError(error.message, 401);
        }
        throw error;
    }
});

export const getEmployees = tryCatch(async (req: Request, res: Response) => {
    const employees = await AuthService.getEmployees();
    res.json(employees);
});
