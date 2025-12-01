import prisma from '../lib/prisma';

export class CommentService {
    static async createComment(issueId: string, content: string, userId: string) {
        return prisma.comment.create({
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
    }

    static async getCommentsByIssue(issueId: string) {
        return prisma.comment.findMany({
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
    }
}
