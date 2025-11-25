import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Issue } from '../models/issue.model';

@Injectable({
  providedIn: 'root'
})
export class IssueService {
  private apiUrl = 'http://localhost:3000/api/issues';

  constructor(private http: HttpClient) { }

  createIssue(issueData: any, imageFile?: File): Observable<Issue> {
    const formData = new FormData();
    formData.append('title', issueData.title);
    formData.append('description', issueData.description);
    formData.append('priority', issueData.priority);

    if (imageFile) {
      formData.append('image', imageFile);
    }

    return this.http.post<Issue>(this.apiUrl, formData);
  }

  getMyIssues(): Observable<Issue[]> {
    return this.http.get<Issue[]>(this.apiUrl);
  }

  getIssueById(id: string): Observable<Issue> {
    return this.http.get<Issue>(`${this.apiUrl}/${id}`);
  }

  getAllIssues(): Observable<Issue[]> {
    return this.http.get<Issue[]>(`${this.apiUrl}/all`);
  }

  assignIssue(issueId: string, assigneeId: string): Observable<Issue> {
    return this.http.patch<Issue>(`${this.apiUrl}/${issueId}/assign`, { assigneeId });
  }

  updateStatus(issueId: string, status: string): Observable<Issue> {
    return this.http.patch<Issue>(`${this.apiUrl}/${issueId}/status`, { status });
  }
}
