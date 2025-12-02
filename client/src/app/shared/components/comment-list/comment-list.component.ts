import { Component, Input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzCommentModule } from 'ng-zorro-antd/comment';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzMessageService } from 'ng-zorro-antd/message';
import { IssueService } from '../../../core/services/issue.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
    selector: 'app-comment-list',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        NzListModule,
        NzCommentModule,
        NzAvatarModule,
        NzInputModule,
        NzButtonModule,
        NzFormModule
    ],
    templateUrl: './comment-list.component.html',
    styleUrls: ['./comment-list.component.scss']
})
export class CommentListComponent implements OnInit {
    @Input() issueId!: string;
    comments = signal<any[]>([]);
    newCommentContent = signal<string>('');
    submitting = signal<boolean>(false);
    user: any;

    constructor(
        private issueService: IssueService,
        private authService: AuthService,
        private message: NzMessageService
    ) {
        this.authService.currentUser$.subscribe(u => this.user = u);
    }

    ngOnInit(): void {
        if (this.issueId) {
            this.loadComments();
        }
    }

    loadComments(): void {
        this.issueService.getComments(this.issueId).subscribe({
            next: (data) => this.comments.set(data),
            error: () => this.message.error('Failed to load comments')
        });
    }

    submitComment(): void {
        const content = this.newCommentContent();
        if (!content.trim()) return;

        this.submitting.set(true);
        this.issueService.addComment(this.issueId, content).subscribe({
            next: (comment) => {
                this.comments.update((current: any[]) => [...current, comment]);
                this.newCommentContent.set('');
                this.submitting.set(false);
                this.message.success('Comment added');
            },
            error: (err) => {
                console.error('Failed to add comment:', err);
                this.submitting.set(false);
                this.message.error('Failed to add comment');
            }
        });
    }
}
