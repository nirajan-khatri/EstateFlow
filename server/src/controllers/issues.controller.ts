import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createIssue = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { title, description, priority } = req.body;
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const files = req.files as Express.Multer.File[];
        const images = files ? files.map(file => `/uploads/${file.filename}`) : [];

        const issue = await prisma.issue.create({
            data: {
                title,
                description,
                priority: priority || 'MEDIUM',
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

        res.status(201).json(issue);
    } catch (error) {
        next(error);
    }
};

export const getMyIssues = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const issues = await prisma.issue.findMany({
            where: {
                reporterId: userId
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        res.json(issues);
    } catch (error) {
        next(error);
    }
};

export const getIssueById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const userId = req.user?.userId;

        const issue = await prisma.issue.findUnique({
            where: { id },
            include: {
                reporter: {
                    select: { name: true, email: true }
                },
                assignee: {
                    select: { name: true, email: true }
                }
            }
        });

        if (!issue) {
            return res.status(404).json({ message: 'Issue not found' });
        }

        // Only allow reporter or manager to view details (can be refined)
        if (issue.reporterId !== userId && req.user?.role !== 'MANAGER') {
            return res.status(403).json({ message: 'Forbidden' });
        }

        res.json(issue);
    } catch (error) {
        next(error);
    }
};

// Manager: Get all issues
export const getAllIssues = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const issues = await prisma.issue.findMany({
            include: {
                reporter: { select: { name: true, email: true } },
                assignee: { select: { name: true, email: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(issues);
    } catch (error) {
        next(error);
    }
};

// Manager: Assign issue
export const assignIssue = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { assigneeId } = req.body;

        const issue = await prisma.issue.update({
            where: { id },
            data: {
                assigneeId,
                auditLogs: {
                    create: {
                        action: 'ASSIGNED',
                        details: `Assigned to user ${assigneeId}`,
                        userId: req.user!.userId
                    }
                }
            }
        });

        res.json(issue);
    } catch (error) {
        next(error);
    }
};

// Manager: Update status
export const updateIssueStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const issue = await prisma.issue.update({
            where: { id },
            data: {
                status,
                auditLogs: {
                    create: {
                        action: 'STATUS_CHANGE',
                        details: `Status updated to ${status}`,
                        userId: req.user!.userId
                    }
                }
            }
        });

        res.json(issue);
    } catch (error) {
        next(error);
    }
};

export const getIssueHistory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const logs = await prisma.auditLog.findMany({
            where: { issueId: id },
            include: {
                user: {
                    select: { name: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(logs);
    } catch (error) {
        next(error);
    }
};
