import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getDashboardStats = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // 1. Total Issues
        const totalIssues = await prisma.issue.count();

        // 2. Counts by Status
        const statusCounts = await prisma.issue.groupBy({
            by: ['status'],
            _count: {
                status: true
            }
        });

        // 3. Counts by Priority
        const priorityCounts = await prisma.issue.groupBy({
            by: ['priority'],
            _count: {
                priority: true
            }
        });

        // 4. Recent Issues (Last 5)
        const recentIssues = await prisma.issue.findMany({
            take: 5,
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                reporter: {
                    select: { name: true }
                },
                assignee: {
                    select: { name: true }
                }
            }
        });

        // Format data for frontend
        const formattedStatusCounts = statusCounts.map(item => ({
            name: item.status,
            value: item._count.status
        }));

        const formattedPriorityCounts = priorityCounts.map(item => ({
            name: item.priority,
            value: item._count.priority
        }));

        res.json({
            totalIssues,
            statusCounts: formattedStatusCounts,
            priorityCounts: formattedPriorityCounts,
            recentIssues
        });
    } catch (error) {
        next(error);
    }
};
