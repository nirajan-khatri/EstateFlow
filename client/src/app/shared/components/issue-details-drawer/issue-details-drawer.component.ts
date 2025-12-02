import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzImageModule } from 'ng-zorro-antd/image';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzTimelineModule } from 'ng-zorro-antd/timeline';
import { Issue, IssueStatus, Priority, AuditLog } from '../../../models/issue.model';
import { User } from '../../../core/services/auth.service';
import { IssueService } from '../../../core/services/issue.service';
import { CommentListComponent } from '../comment-list/comment-list.component';

@Component({
  selector: 'app-issue-details-drawer',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzDrawerModule,
    NzDescriptionsModule,
    NzSelectModule,
    NzButtonModule,
    NzTagModule,
    NzImageModule,
    NzDividerModule,
    NzTimelineModule,
    CommentListComponent
  ],
  templateUrl: './issue-details-drawer.component.html',
  styleUrls: ['./issue-details-drawer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IssueDetailsDrawerComponent implements OnChanges {
  @Input() visible = false;
  @Input() issue: Issue | null = null;
  @Input() employees: User[] = [];
  @Input() isManager = false;
  @Output() close = new EventEmitter<void>();
  @Output() issueUpdated = new EventEmitter<Issue>();

  private issueService = inject(IssueService);
  private message = inject(NzMessageService);

  selectedAssignee: string | null = null;
  selectedStatus: IssueStatus | null = null;
  statuses = Object.values(IssueStatus);

  isLoading = signal(false);
  auditLogs = signal<AuditLog[]>([]);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['issue'] && this.issue) {
      this.selectedAssignee = this.issue.assigneeId || null;
      this.selectedStatus = this.issue.status;
      this.loadAuditLogs();
    }
  }

  loadAuditLogs(): void {
    if (!this.issue) return;
    this.issueService.getIssueHistory(this.issue.id).subscribe({
      next: (logs) => this.auditLogs.set(logs),
      error: () => console.error('Failed to load audit logs')
    });
  }

  onClose(): void {
    this.close.emit();
  }

  assignIssue(): void {
    if (!this.issue || !this.selectedAssignee) return;

    this.isLoading.set(true);
    this.issueService.assignIssue(this.issue.id, this.selectedAssignee).subscribe({
      next: (updatedIssue) => {
        this.message.success('Issue assigned successfully');
        this.issueUpdated.emit(updatedIssue);
        this.loadAuditLogs();
        this.isLoading.set(false);
      },
      error: () => {
        this.message.error('Failed to assign issue');
        this.isLoading.set(false);
      }
    });
  }

  updateStatus(): void {
    if (!this.issue || !this.selectedStatus) return;

    this.isLoading.set(true);
    this.issueService.updateStatus(this.issue.id, this.selectedStatus).subscribe({
      next: (updatedIssue) => {
        this.message.success('Status updated successfully');
        this.issueUpdated.emit(updatedIssue);
        this.loadAuditLogs();
        this.isLoading.set(false);
      },
      error: () => {
        this.message.error('Failed to update status');
        this.isLoading.set(false);
      }
    });
  }

  getPriorityColor(priority: Priority): string {
    switch (priority) {
      case Priority.CRITICAL: return 'red';
      case Priority.HIGH: return 'orange';
      case Priority.MEDIUM: return 'blue';
      case Priority.LOW: return 'green';
      default: return 'default';
    }
  }
}
