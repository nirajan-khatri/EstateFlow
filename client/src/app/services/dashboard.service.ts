import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DashboardStats {
  totalIssues: number;
  statusCounts: { name: string; value: number }[];
  priorityCounts: { name: string; value: number }[];
  recentIssues: any[];
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = 'http://localhost:3000/api/dashboard';

  constructor(private http: HttpClient) { }

  getStats(startDate?: string, endDate?: string): Observable<DashboardStats> {
    let params: any = {};
    if (startDate && endDate) {
      params = { startDate, endDate };
    }
    return this.http.get<DashboardStats>(`${this.apiUrl}/stats`, { params });
  }
}
