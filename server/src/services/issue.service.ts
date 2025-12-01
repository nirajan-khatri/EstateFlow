import prisma from '../lib/prisma';

export class IssueService {
    static async createIssue(data: any, userId: string, images: string[]) {
        return prisma.issue.create({
            data: {
                title: data.title,
                description: data.description,
                priority: data.priority || 'MEDIUM',
                status: 'OPEN',
                images,
                reporterId: userId,
                auditLogs: {
                    create: {
                        action: 'CREATED',
                        details: 'Issue reported',
                        userId
                    }
                }
            }
        });
    }

    static async getMyIssues(userId: string) {
        return prisma.issue.findMany({
            where: { reporterId: userId },
            orderBy: { createdAt: 'desc' }
        });
    }

    static async getIssueById(id: string) {
        return prisma.issue.findUnique({
            where: { id },
            include: {
                reporter: { select: { name: true, email: true } },
                assignee: { select: { name: true, email: true } }
            }
        });
    }

    static async getAllIssues() {
        return prisma.issue.findMany({
            include: {
                reporter: { select: { name: true, email: true } },
                assignee: { select: { name: true, email: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
    }

    static async assignIssue(id: string, assigneeId: string, userId: string) {
        return prisma.issue.update({
            where: { id },
            data: {
                assigneeId,
                auditLogs: {
                    create: {
                        action: 'ASSIGNED',
                        details: `Assigned to user ${assigneeId}`,
                        userId
                    }
                }
            }
        });
    }

    static async updateIssueStatus(id: string, status: any, userId: string) {
        return prisma.issue.update({
            where: { id },
            data: {
                status,
                auditLogs: {
                    create: {
                        action: 'STATUS_CHANGE',
                        details: `Status updated to ${status}`,
                        userId
                    }
                }
            }
        });
    }

    static async getIssueHistory(id: string) {
        return prisma.auditLog.findMany({
            where: { issueId: id },
            include: {
                user: { select: { name: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
    }
}
