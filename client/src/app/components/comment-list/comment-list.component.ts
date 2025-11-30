import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzCommentModule } from 'ng-zorro-antd/comment';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzMessageService } from 'ng-zorro-antd/message';
import { IssueService } from '../../services/issue.service';
import { AuthService } from '../../services/auth.service';

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
    comments: any[] = [];
    newCommentContent = '';
    submitting = false;
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
            next: (data) => this.comments = data,
            error: () => this.message.error('Failed to load comments')
        });
    }

    submitComment(): void {
        if (!this.newCommentContent.trim()) return;

        this.submitting = true;
        this.issueService.addComment(this.issueId, this.newCommentContent).subscribe({
            next: (comment) => {
                this.comments = [...this.comments, comment];
                this.newCommentContent = '';
                this.submitting = false;
                this.message.success('Comment added');
            },
            error: () => {
                this.submitting = false;
                this.message.error('Failed to add comment');
            }
        });
    }
}
