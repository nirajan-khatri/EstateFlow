import { Request, Response } from 'express';
import { CommentService } from '../services/comment.service';
import { tryCatch } from '../utils/tryCatch';
import { AppError } from '../utils/AppError';

export const createComment = tryCatch(async (req: Request, res: Response) => {
    const { issueId } = req.params;
    const { content } = req.body;
    const userId = (req as any).user.userId;

    if (!content) throw new AppError('Comment content is required', 400);

    const comment = await CommentService.createComment(issueId, content, userId);

    res.status(201).json(comment);
});

export const getCommentsByIssue = tryCatch(async (req: Request, res: Response) => {
    const { issueId } = req.params;
    const comments = await CommentService.getCommentsByIssue(issueId);
    res.json(comments);
});
