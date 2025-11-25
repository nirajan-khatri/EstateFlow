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
    imageUrl?: string;
    reporterId: string;
    assigneeId?: string;
    createdAt: Date;
    updatedAt: Date;
}
