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

  updateStatus(id: string, status: any): Observable<Issue> {
    return this.http.patch<Issue>(`${this.apiUrl}/${id}/status`, { status });
  }

  getComments(issueId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${issueId}/comments`);
  }

  addComment(issueId: string, content: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${issueId}/comments`, { content });
  }
}
