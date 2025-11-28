import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { IssueService } from '../../services/issue.service';
import { AuthService, User } from '../../services/auth.service';
import { Issue, Priority, IssueStatus } from '../../models/issue.model';
import { IssueDetailsDrawerComponent } from '../../components/issue-details-drawer/issue-details-drawer.component';

@Component({
  selector: 'app-manager-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzTableModule,
    NzTagModule,
    NzButtonModule,
    NzIconModule,
    NzCardModule,
    NzSelectModule,
    NzDrawerModule,
    NzEmptyModule,
    IssueDetailsDrawerComponent
  ],
  templateUrl: './manager-dashboard.component.html',
  styleUrls: ['./manager-dashboard.component.scss']
})
export class ManagerDashboardComponent implements OnInit {
  issues: Issue[] = [];
  filteredIssues: Issue[] = [];
  loading = true;
  employees: User[] = [];

  // Filters
  statusFilter: IssueStatus | 'ALL' = 'ALL';
  priorityFilter: Priority | 'ALL' = 'ALL';
  statuses = Object.values(IssueStatus);
  priorities = Object.values(Priority);

  // Drawer
  drawerVisible = false;
  selectedIssue: Issue | null = null;

  constructor(
    private issueService: IssueService,
    private authService: AuthService,
    private message: NzMessageService
  ) { }

  ngOnInit(): void {
    this.loadIssues();
    this.loadEmployees();
  }

  loadIssues(): void {
    this.loading = true;
    this.issueService.getAllIssues().subscribe({
      next: (data) => {
        this.issues = data;
        this.filterIssues();
        this.loading = false;
      },
      error: (err) => {
        this.message.error('Failed to load issues');
        this.loading = false;
      }
    });
  }

  loadEmployees(): void {
    this.authService.getEmployees().subscribe({
      next: (data) => this.employees = data,
      error: () => this.message.error('Failed to load employees')
    });
  }

  filterIssues(): void {
    this.filteredIssues = this.issues.filter(issue => {
      const matchStatus = this.statusFilter === 'ALL' || issue.status === this.statusFilter;
      const matchPriority = this.priorityFilter === 'ALL' || issue.priority === this.priorityFilter;
      return matchStatus && matchPriority;
    });
  }

  openDrawer(issue: Issue): void {
    this.selectedIssue = issue;
    this.drawerVisible = true;
  }

  closeDrawer(): void {
    this.drawerVisible = false;
    this.selectedIssue = null;
  }

  onIssueUpdated(updatedIssue: Issue): void {
    const index = this.issues.findIndex(i => i.id === updatedIssue.id);
    if (index !== -1) {
      this.issues[index] = updatedIssue;
      this.filterIssues();
    }
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
