import { Component, OnInit, ChangeDetectionStrategy, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, moveItemInArray, transferArrayItem, DragDropModule } from '@angular/cdk/drag-drop';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzSpinModule } from 'ng-zorro-antd/spin';

import { IssueService } from '../../core/services/issue.service';
import { Issue, IssueStatus, Priority } from '../../models/issue.model';

@Component({
    selector: 'app-kanban-board',
    standalone: true,
    imports: [
        CommonModule,
        DragDropModule,
        NzCardModule,
        NzTagModule,
        NzAvatarModule,
        NzIconModule,
        NzSpinModule
    ],
    templateUrl: './kanban-board.component.html',
    styleUrls: ['./kanban-board.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class KanbanBoardComponent implements OnInit {
    private issueService = inject(IssueService);
    private message = inject(NzMessageService);

    // Signals for each column
    openIssues = signal<Issue[]>([]);
    inProgressIssues = signal<Issue[]>([]);
    resolvedIssues = signal<Issue[]>([]);
    closedIssues = signal<Issue[]>([]);

    isLoading = this.issueService.loading;

    ngOnInit(): void {
        this.loadIssues();
    }

    loadIssues(): void {
        this.issueService.getAllIssues().subscribe(issues => {
            this.distributeIssues(issues);
        });
    }

    distributeIssues(issues: Issue[]): void {
        this.openIssues.set(issues.filter(i => i.status === IssueStatus.OPEN));
        this.inProgressIssues.set(issues.filter(i => i.status === IssueStatus.IN_PROGRESS));
        this.resolvedIssues.set(issues.filter(i => i.status === IssueStatus.RESOLVED));
        this.closedIssues.set(issues.filter(i => i.status === IssueStatus.CLOSED));
    }

    drop(event: CdkDragDrop<Issue[]>): void {
        if (event.previousContainer === event.container) {
            // Reordering within the same column (Visual only for now, backend doesn't support rank)
            const list = [...event.container.data];
            moveItemInArray(list, event.previousIndex, event.currentIndex);

            // Update the specific signal based on the container id
            this.updateSignalByStatus(event.container.id as IssueStatus, list);
        } else {
            // Moving between columns
            const previousList = [...event.previousContainer.data];
            const currentList = [...event.container.data];

            transferArrayItem(
                previousList,
                currentList,
                event.previousIndex,
                event.currentIndex,
            );

            // Update signals visually first
            this.updateSignalByStatus(event.previousContainer.id as IssueStatus, previousList);
            this.updateSignalByStatus(event.container.id as IssueStatus, currentList);

            // Call API to update status
            const issue = currentList[event.currentIndex];
            const newStatus = event.container.id as IssueStatus;

            this.issueService.updateStatus(issue.id, newStatus).subscribe({
                next: () => {
                    this.message.success(`Issue moved to ${newStatus}`);
                },
                error: () => {
                    this.message.error('Failed to update issue status');
                    // Revert changes on error (reload issues)
                    this.loadIssues();
                }
            });
        }
    }

    updateSignalByStatus(status: IssueStatus, issues: Issue[]): void {
        switch (status) {
            case IssueStatus.OPEN: this.openIssues.set(issues); break;
            case IssueStatus.IN_PROGRESS: this.inProgressIssues.set(issues); break;
            case IssueStatus.RESOLVED: this.resolvedIssues.set(issues); break;
            case IssueStatus.CLOSED: this.closedIssues.set(issues); break;
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
}
