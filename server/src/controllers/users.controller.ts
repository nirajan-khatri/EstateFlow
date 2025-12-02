import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service'; // We can reuse AuthService methods or move them to UserService later
import { tryCatch } from '../utils/tryCatch';

export const getEmployees = tryCatch(async (req: Request, res: Response) => {
    const employees = await AuthService.getEmployees();
    res.json(employees);
});
