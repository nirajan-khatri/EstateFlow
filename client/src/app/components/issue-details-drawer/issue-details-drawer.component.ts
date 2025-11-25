import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzImageModule } from 'ng-zorro-antd/image';
import { Issue, IssueStatus, Priority } from '../../models/issue.model';
import { User } from '../../services/auth.service';
import { IssueService } from '../../services/issue.service';

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
    NzImageModule
  ],
  templateUrl: './issue-details-drawer.component.html',
  styleUrls: ['./issue-details-drawer.component.scss']
})
export class IssueDetailsDrawerComponent implements OnChanges {
  @Input() visible = false;
  @Input() issue: Issue | null = null;
  @Input() employees: User[] = [];
  @Output() close = new EventEmitter<void>();
  @Output() issueUpdated = new EventEmitter<Issue>();

  selectedAssignee: string | null = null;
  selectedStatus: IssueStatus | null = null;
  statuses = Object.values(IssueStatus);
  isLoading = false;

  constructor(
    private issueService: IssueService,
    private message: NzMessageService
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['issue'] && this.issue) {
      this.selectedAssignee = this.issue.assigneeId || null;
      this.selectedStatus = this.issue.status;
    }
  }

  onClose(): void {
    this.close.emit();
  }

  assignIssue(): void {
    if (!this.issue || !this.selectedAssignee) return;

    this.isLoading = true;
    this.issueService.assignIssue(this.issue.id, this.selectedAssignee).subscribe({
      next: (updatedIssue) => {
        this.message.success('Issue assigned successfully');
        this.issueUpdated.emit(updatedIssue);
        this.isLoading = false;
      },
      error: () => {
        this.message.error('Failed to assign issue');
        this.isLoading = false;
      }
    });
  }

  updateStatus(): void {
    if (!this.issue || !this.selectedStatus) return;

    this.isLoading = true;
    this.issueService.updateStatus(this.issue.id, this.selectedStatus).subscribe({
      next: (updatedIssue) => {
        this.message.success('Status updated successfully');
        this.issueUpdated.emit(updatedIssue);
        this.isLoading = false;
      },
      error: () => {
        this.message.error('Failed to update status');
        this.isLoading = false;
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
