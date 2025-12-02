import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, finalize } from 'rxjs';
import { Issue } from '../../models/issue.model';

@Injectable({
  providedIn: 'root'
})
export class IssueService {
  private apiUrl = 'http://localhost:3000/api/issues';

  // State Signals
  private issuesSignal = signal<Issue[]>([]);
  private loadingSignal = signal<boolean>(false);
  private errorSignal = signal<string | null>(null);

  // Computed Signals (Read-only)
  readonly issues = computed(() => this.issuesSignal());
  readonly loading = computed(() => this.loadingSignal());
  readonly error = computed(() => this.errorSignal());

  constructor(private http: HttpClient) { }

  createIssue(issueData: any, files: File[]): Observable<Issue> {
    this.loadingSignal.set(true);
    const formData = new FormData();
    formData.append('title', issueData.title);
    formData.append('description', issueData.description);
    formData.append('priority', issueData.priority);

    if (files && files.length > 0) {
      files.forEach(file => {
        formData.append('images', file);
      });
    }

    return this.http.post<Issue>(this.apiUrl, formData).pipe(
      tap(newIssue => {
        this.issuesSignal.update(issues => [newIssue, ...issues]);
      }),
      finalize(() => this.loadingSignal.set(false))
    );
  }

  getMyIssues(): Observable<Issue[]> {
    this.loadingSignal.set(true);
    return this.http.get<Issue[]>(this.apiUrl).pipe(
      tap(issues => this.issuesSignal.set(issues)),
      finalize(() => this.loadingSignal.set(false))
    );
  }

  getIssueById(id: string): Observable<Issue> {
    return this.http.get<Issue>(`${this.apiUrl}/${id}`);
  }

  getAllIssues(): Observable<Issue[]> {
    this.loadingSignal.set(true);
    return this.http.get<Issue[]>(`${this.apiUrl}/all`).pipe(
      tap(issues => this.issuesSignal.set(issues)),
      finalize(() => this.loadingSignal.set(false))
    );
  }

  assignIssue(issueId: string, assigneeId: string): Observable<Issue> {
    return this.http.patch<Issue>(`${this.apiUrl}/${issueId}/assign`, { assigneeId }).pipe(
      tap(updatedIssue => {
        this.issuesSignal.update(issues =>
          issues.map(i => i.id === updatedIssue.id ? updatedIssue : i)
        );
      })
    );
  }

  updateStatus(id: string, status: any): Observable<Issue> {
    return this.http.patch<Issue>(`${this.apiUrl}/${id}/status`, { status }).pipe(
      tap(updatedIssue => {
        this.issuesSignal.update(issues =>
          issues.map(i => i.id === updatedIssue.id ? updatedIssue : i)
        );
      })
    );
  }

  getComments(issueId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${issueId}/comments`);
  }

  addComment(issueId: string, content: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${issueId}/comments`, { content });
  }

  getIssueHistory(issueId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${issueId}/history`);
  }
}
