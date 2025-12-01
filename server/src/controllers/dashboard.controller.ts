import { Request, Response, NextFunction } from 'express';
import { DashboardService } from '../services/dashboard.service';
import { tryCatch } from '../utils/tryCatch';

export const getDashboardStats = tryCatch(async (req: Request, res: Response) => {
    const { startDate, endDate } = req.query;
    const stats = await DashboardService.getStats(startDate as string, endDate as string);
    res.json(stats);
});
