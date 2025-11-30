import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createComment = async (req: Request, res: Response) => {
    try {
        const { issueId } = req.params;
        const { content } = req.body;
        const userId = (req as any).user.userId;

        const comment = await prisma.comment.create({
            data: {
                content,
                issueId,
                userId
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });

        res.status(201).json(comment);
    } catch (error) {
        res.status(500).json({ message: 'Error creating comment', error });
    }
};

export const getCommentsByIssue = async (req: Request, res: Response) => {
    try {
        const { issueId } = req.params;

        const comments = await prisma.comment.findMany({
            where: { issueId },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            },
            orderBy: {
                createdAt: 'asc'
            }
        });

        res.json(comments);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching comments', error });
    }
};
