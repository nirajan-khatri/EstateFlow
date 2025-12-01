import prisma from '../lib/prisma';

export class DashboardService {
    static async getStats(startDate?: string, endDate?: string) {
        const where: any = {};

        if (startDate && endDate) {
            where.createdAt = {
                gte: new Date(startDate),
                lte: new Date(endDate)
            };
        }

        // 1. Total Issues
        const totalIssues = await prisma.issue.count({ where });

        // 2. Counts by Status
        const statusCounts = await prisma.issue.groupBy({
            by: ['status'],
            where,
            _count: {
                status: true
            }
        });

        // 3. Counts by Priority
        const priorityCounts = await prisma.issue.groupBy({
            by: ['priority'],
            where,
            _count: {
                priority: true
            }
        });

        // 4. Recent Issues (Last 5)
        const recentIssues = await prisma.issue.findMany({
            take: 5,
            where,
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

        // Format data
        const formattedStatusCounts = statusCounts.map(item => ({
            name: item.status,
            value: item._count.status
        }));

        const formattedPriorityCounts = priorityCounts.map(item => ({
            name: item.priority,
            value: item._count.priority
        }));

        return {
            totalIssues,
            statusCounts: formattedStatusCounts,
            priorityCounts: formattedPriorityCounts,
            recentIssues
        };
    }
}
