import { Component, OnInit, ChangeDetectionStrategy, signal, computed, inject, effect } from '@angular/core';
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
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { IssueService } from '../../core/services/issue.service';
import { AuthService, User } from '../../core/services/auth.service';
import { DashboardService, DashboardStats } from '../../core/services/dashboard.service';
import { SocketService } from '../../core/services/socket.service';
import { Issue, Priority, IssueStatus } from '../../models/issue.model';
import { IssueDetailsDrawerComponent } from '../../shared/components/issue-details-drawer/issue-details-drawer.component';

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
    NzStatisticModule,
    NzGridModule,
    NzDatePickerModule,
    BaseChartDirective,
    IssueDetailsDrawerComponent
  ],
  templateUrl: './manager-dashboard.component.html',
  styleUrls: ['./manager-dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ManagerDashboardComponent implements OnInit {
  public issueService = inject(IssueService);
  private authService = inject(AuthService);
  private dashboardService = inject(DashboardService);
  private socketService = inject(SocketService);
  private message = inject(NzMessageService);

  // Filters (Signals)
  statusFilter = signal<IssueStatus | 'ALL'>('ALL');
  priorityFilter = signal<Priority | 'ALL'>('ALL');

  // Computed Filtered Issues
  filteredIssues = computed(() => {
    const issues = this.issueService.issues();
    const status = this.statusFilter();
    const priority = this.priorityFilter();

    return issues.filter(issue => {
      const matchStatus = status === 'ALL' || issue.status === status;
      const matchPriority = priority === 'ALL' || issue.priority === priority;
      return matchStatus && matchPriority;
    });
  });

  employees: User[] = [];

  // Analytics Data
  stats = signal<DashboardStats | null>(null);
  dateRange: Date[] = [];

  // Bar Chart (Status)
  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [{ data: [], label: 'Issues' }]
  };
  public barChartOptions: ChartOptions<'bar'> = { responsive: true };

  // Pie Chart (Priority)
  public pieChartData: ChartConfiguration<'pie'>['data'] = {
    labels: [],
    datasets: [{ data: [] }]
  };
  public pieChartOptions: ChartOptions<'pie'> = { responsive: true };

  statuses = Object.values(IssueStatus);
  priorities = Object.values(Priority);

  // Drawer
  drawerVisible = false;
  selectedIssue: Issue | null = null;

  constructor() { }

  ngOnInit(): void {
    this.issueService.getAllIssues().subscribe();
    this.loadEmployees();
    this.loadStats();
    this.setupRealtimeUpdates();
  }

  setupRealtimeUpdates(): void {
    const events = ['issue:created', 'issue:assigned', 'issue:status_change'];
    events.forEach(event => {
      this.socketService.on(event).subscribe(() => {
        this.loadStats();
        this.issueService.getAllIssues().subscribe(); // Refresh issues
      });
    });
  }

  loadStats(): void {
    let startDate: string | undefined;
    let endDate: string | undefined;

    if (this.dateRange && this.dateRange.length === 2) {
      startDate = this.dateRange[0].toISOString();
      endDate = this.dateRange[1].toISOString();
    }

    this.dashboardService.getStats(startDate, endDate).subscribe({
      next: (data) => {
        this.stats.set(data);
        this.updateCharts(data);
      },
      error: (err) => console.error('Failed to load stats', err)
    });
  }

  updateCharts(data: DashboardStats): void {
    this.barChartData = {
      labels: data.statusCounts.map((s: { name: string; value: number }) => s.name),
      datasets: [{ data: data.statusCounts.map((s: { name: string; value: number }) => s.value), label: 'Issues' }]
    };

    this.pieChartData = {
      labels: data.priorityCounts.map((p: { name: string; value: number }) => p.name),
      datasets: [{ data: data.priorityCounts.map((p: { name: string; value: number }) => p.value) }]
    };
  }

  onDateChange(result: Date[]): void {
    this.dateRange = result;
    this.loadStats();
  }

  exportToCSV(): void {
    const currentStats = this.stats();
    if (!currentStats || !currentStats.recentIssues) return;

    const issues = currentStats.recentIssues;
    const headers = ['Title', 'Description', 'Priority', 'Status', 'Reporter', 'Assignee', 'Created At'];

    const csvContent = [
      headers.join(','),
      ...issues.map((issue: any) => {
        return [
          `"${issue.title.replace(/"/g, '""')}"`,
          `"${issue.description.replace(/"/g, '""')}"`,
          issue.priority,
          issue.status,
          issue.reporter?.name || 'Unknown',
          issue.assignee?.name || 'Unassigned',
          new Date(issue.createdAt).toLocaleString()
        ].join(',');
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `issues_report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  loadEmployees(): void {
    this.authService.getEmployees().subscribe({
      next: (data) => this.employees = data,
      error: () => this.message.error('Failed to load employees')
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
    // Service handles update via signal, but we might need to refresh if not using the same instance
    // Since we use singleton service, it should be fine.
    // But if the drawer updates the issue via API, we should re-fetch or update local state.
    // The drawer component likely calls service.update... which updates the signal.
    // So we might not need to do anything here if the signal is updated.
    this.issueService.getAllIssues().subscribe();
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
