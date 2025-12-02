import { Component, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzMessageService } from 'ng-zorro-antd/message';
import { IssueService } from '../../core/services/issue.service';
import { Issue, Priority, IssueStatus } from '../../models/issue.model';
import { IssueDetailsDrawerComponent } from '../../shared/components/issue-details-drawer/issue-details-drawer.component';

@Component({
    selector: 'app-assigned-issues',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        NzTableModule,
        NzTagModule,
        NzButtonModule,
        NzCardModule,
        NzEmptyModule,
        IssueDetailsDrawerComponent
    ],
    template: `
    <div class="assigned-issues-container">
      <nz-card nzTitle="My Assigned Issues">
        <nz-table #basicTable [nzData]="issues()" [nzLoading]="loading()" [nzNoResult]="noResultTemplate">
          <thead>
            <tr>
              <th>Title</th>
              <th>Reporter</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            @for (data of basicTable.data; track data.id) {
            <tr>
              <td>{{ data.title }}</td>
              <td>{{ data.reporter?.name || data.reporterId }}</td>
              <td>
                <nz-tag [nzColor]="getPriorityColor(data.priority)">{{ data.priority }}</nz-tag>
              </td>
              <td>
                <nz-tag [nzColor]="getStatusColor(data.status)">{{ data.status }}</nz-tag>
              </td>
              <td>{{ data.createdAt | date:'short' }}</td>
              <td>
                <a nz-button nzType="link" (click)="openDrawer(data)">View</a>
              </td>
            </tr>
            }
          </tbody>
        </nz-table>
      </nz-card>

      <ng-template #noResultTemplate>
        <nz-empty nzNotFoundImage="simple" nzNotFoundContent="No issues assigned to you"></nz-empty>
      </ng-template>

      <app-issue-details-drawer 
        [visible]="drawerVisible" 
        [issue]="selectedIssue" 
        [isManager]="false"
        (close)="closeDrawer()"
        (issueUpdated)="loadIssues()">
      </app-issue-details-drawer>
    </div>
  `,
    styles: [`
    .assigned-issues-container {
      padding: 24px;
    }
  `],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AssignedIssuesComponent implements OnInit {
    issues = signal<Issue[]>([]);
    loading = signal<boolean>(false);
    drawerVisible = false;
    selectedIssue: Issue | null = null;

    constructor(
        private issueService: IssueService,
        privatemessage: NzMessageService
    ) { }

    ngOnInit(): void {
        this.loadIssues();
    }

    loadIssues(): void {
        this.loading.set(true);
        this.issueService.getAssignedIssues().subscribe({
            next: (data) => {
                this.issues.set(data);
                this.loading.set(false);
            },
            error: () => {
                this.loading.set(false);
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

    getStatusColor(status: IssueStatus): string {
        switch (status) {
            case IssueStatus.OPEN: return 'blue';
            case IssueStatus.IN_PROGRESS: return 'orange';
            case IssueStatus.RESOLVED: return 'green';
            case IssueStatus.CLOSED: return 'gray';
            default: return 'default';
        }
    }

    openDrawer(issue: Issue): void {
        this.selectedIssue = issue;
        this.drawerVisible = true;
    }

    closeDrawer(): void {
        this.drawerVisible = false;
        this.selectedIssue = null;
    }
}
