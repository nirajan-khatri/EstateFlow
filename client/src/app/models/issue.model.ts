export enum Priority {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH',
    CRITICAL = 'CRITICAL'
}

export enum IssueStatus {
    OPEN = 'OPEN',
    IN_PROGRESS = 'IN_PROGRESS',
    RESOLVED = 'RESOLVED',
    CLOSED = 'CLOSED'
}

export interface Issue {
    id: string;
    title: string;
    description: string;
    priority: Priority;
    status: IssueStatus;
    images?: string[];
    reporterId: string;
    reporter?: { name: string; email: string };
    assigneeId?: string;
    assignee?: { name: string; email: string };
    createdAt: Date;
    updatedAt: Date;
}

export interface AuditLog {
    id: string;
    action: string;
    details: string;
    createdAt: Date;
    user: {
        name: string;
    };
}
