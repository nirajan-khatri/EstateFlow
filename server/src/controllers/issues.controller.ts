import { Request, Response, NextFunction } from 'express';
import { IssueService } from '../services/issue.service';
import { io } from '../index';
import { tryCatch } from '../utils/tryCatch';
import { AppError } from '../utils/AppError';

export const createIssue = tryCatch(async (req: Request, res: Response) => {
    const { title, description } = req.body;
    const userId = req.user?.userId;

    if (!userId) throw new AppError('Unauthorized', 401);
    if (!title || !description) throw new AppError('Please provide title and description', 400);

    const files = req.files as Express.Multer.File[];
    const images = files ? files.map(file => `/uploads/${file.filename}`) : [];

    const issue = await IssueService.createIssue(req.body, userId, images);

    io.emit('issue:created', issue);
    res.status(201).json(issue);
});

export const getMyIssues = tryCatch(async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    if (!userId) throw new AppError('Unauthorized', 401);

    const issues = await IssueService.getMyIssues(userId);
    res.json(issues);
});

export const getAssignedIssues = tryCatch(async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    if (!userId) throw new AppError('Unauthorized', 401);

    const issues = await IssueService.getAssignedIssues(userId);
    res.json(issues);
});

export const getIssueById = tryCatch(async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.user?.userId;

    const issue = await IssueService.getIssueById(id);

    if (!issue) throw new AppError('Issue not found', 404);

    if (issue.reporterId !== userId && req.user?.role !== 'MANAGER') {
        throw new AppError('Forbidden', 403);
    }

    res.json(issue);
});

export const getAllIssues = tryCatch(async (req: Request, res: Response) => {
    const issues = await IssueService.getAllIssues();
    res.json(issues);
});

export const assignIssue = tryCatch(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { assigneeId } = req.body;
    const userId = req.user!.userId;

    const issue = await IssueService.assignIssue(id, assigneeId, userId);

    if (assigneeId) {
        io.to(assigneeId).emit('issue:assigned', issue);
    }

    res.json(issue);
});

export const updateIssueStatus = tryCatch(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user!.userId;

    const issue = await IssueService.updateIssueStatus(id, status, userId);

    const recipients = new Set<string>();
    if (issue.assigneeId) recipients.add(issue.assigneeId);
    recipients.add(issue.reporterId);

    recipients.forEach(recipientId => {
        io.to(recipientId).emit('issue:status_change', issue);
    });

    res.json(issue);
});

export const getIssueHistory = tryCatch(async (req: Request, res: Response) => {
    const { id } = req.params;
    const logs = await IssueService.getIssueHistory(id);
    res.json(logs);
});
