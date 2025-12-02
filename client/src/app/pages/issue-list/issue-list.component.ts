import { Component, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { IssueService } from '../../core/services/issue.service';
import { Issue, Priority, IssueStatus } from '../../models/issue.model';
import { IssueDetailsDrawerComponent } from '../../shared/components/issue-details-drawer/issue-details-drawer.component';

@Component({
  selector: 'app-issue-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NzTableModule,
    NzTagModule,
    NzButtonModule,
    NzIconModule,
    NzCardModule,
    NzEmptyModule,
    IssueDetailsDrawerComponent
  ],
  templateUrl: './issue-list.component.html',
  styleUrls: ['./issue-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IssueListComponent implements OnInit {
  public issueService = inject(IssueService);

  // Drawer
  drawerVisible = false;
  selectedIssue: Issue | null = null;

  ngOnInit(): void {
    this.issueService.getMyIssues().subscribe();
  }

  openDrawer(issue: Issue): void {
    this.selectedIssue = issue;
    this.drawerVisible = true;
  }

  closeDrawer(): void {
    this.drawerVisible = false;
    this.selectedIssue = null;
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

  getStatusColor(status: IssueStatus): string {
    switch (status) {
      case IssueStatus.OPEN: return 'blue';
      case IssueStatus.IN_PROGRESS: return 'processing';
      case IssueStatus.RESOLVED: return 'success';
      case IssueStatus.CLOSED: return 'default';
      default: return 'default';
    }
  }
}
