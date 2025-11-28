import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { DashboardService, DashboardStats } from '../../services/dashboard.service';

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
    NzTagModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  stats: DashboardStats | null = null;
  loading = true;

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

  constructor(private dashboardService: DashboardService) { }

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.loading = true;
    this.dashboardService.getStats().subscribe({
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
      labels: data.statusCounts.map(s => s.name),
      datasets: [
        { data: data.statusCounts.map(s => s.value), label: 'Issues' }
      ]
    };

    // Update Pie Chart
    this.pieChartData = {
      labels: data.priorityCounts.map(p => p.name),
      datasets: [
        { data: data.priorityCounts.map(p => p.value) }
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
}
