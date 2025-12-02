import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { FormsModule } from '@angular/forms';
import { DashboardService, DashboardStats } from '../../core/services/dashboard.service';
import { SocketService } from '../../core/services/socket.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    BaseChartDirective,
    NzCardModule,
    NzStatisticModule,
    NzGridModule,
    NzTableModule,
    NzTagModule,
    NzButtonModule,
    NzDatePickerModule,
    FormsModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  stats: DashboardStats | null = null;
  loading = true;
  dateRange: Date[] = [];

  // Bar Chart (Status)
  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [
      { data: [], label: 'Issues' }
    ]
  };
  public barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
  };

  // Pie Chart (Priority)
  public pieChartData: ChartConfiguration<'pie'>['data'] = {
    labels: [],
    datasets: [
      { data: [] }
    ]
  };
  public pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
  };

  constructor(
    private dashboardService: DashboardService,
    private socketService: SocketService
  ) { }

  ngOnInit(): void {
    this.loadStats();
    this.setupRealtimeUpdates();
  }

  setupRealtimeUpdates(): void {
    const events = ['issue:created', 'issue:assigned', 'issue:status_change'];
    events.forEach(event => {
      this.socketService.on(event).subscribe(() => {
        this.loadStats();
      });
    });
  }

  onDateChange(result: Date[]): void {
    this.dateRange = result;
    this.loadStats();
  }

  loadStats(): void {
    this.loading = true;
    let startDate: string | undefined;
    let endDate: string | undefined;

    if (this.dateRange && this.dateRange.length === 2) {
      startDate = this.dateRange[0].toISOString();
      endDate = this.dateRange[1].toISOString();
    }

    this.dashboardService.getStats(startDate, endDate).subscribe({
      next: (data) => {
        this.stats = data;
        this.updateCharts(data);
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load dashboard stats', err);
        this.loading = false;
      }
    });
  }

  updateCharts(data: DashboardStats): void {
    // Update Bar Chart
    this.barChartData = {
      labels: data.statusCounts.map((s: { name: string; value: number }) => s.name),
      datasets: [
        { data: data.statusCounts.map((s: { name: string; value: number }) => s.value), label: 'Issues' }
      ]
    };

    // Update Pie Chart
    this.pieChartData = {
      labels: data.priorityCounts.map((p: { name: string; value: number }) => p.name),
      datasets: [
        { data: data.priorityCounts.map((p: { name: string; value: number }) => p.value) }
      ]
    };
  }

  getPriorityColor(priority: string): string {
    switch (priority) {
      case 'CRITICAL': return 'red';
      case 'HIGH': return 'orange';
      case 'MEDIUM': return 'blue';
      case 'LOW': return 'green';
      default: return 'default';
    }
  }

  exportToCSV(): void {
    if (!this.stats || !this.stats.recentIssues) return;

    const issues = this.stats.recentIssues;
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
}
