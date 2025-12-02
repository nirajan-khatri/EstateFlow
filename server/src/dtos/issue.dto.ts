import { IsEnum, IsNotEmpty, IsString, IsOptional, IsUUID } from 'class-validator';

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

export class CreateIssueDto {
    @IsString()
    @IsNotEmpty()
    title!: string;

    @IsString()
    @IsNotEmpty()
    description!: string;

    @IsEnum(Priority)
    priority!: Priority;
}

export class UpdateStatusDto {
    @IsEnum(IssueStatus)
    status!: IssueStatus;
}

export class AssignIssueDto {
    @IsUUID()
    @IsNotEmpty()
    assigneeId!: string;
}
