import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzUploadModule, NzUploadFile } from 'ng-zorro-antd/upload';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzCardModule } from 'ng-zorro-antd/card';
import { IssueService } from '../../services/issue.service';
import { Priority } from '../../models/issue.model';

@Component({
  selector: 'app-create-issue',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzSelectModule,
    NzUploadModule,
    NzCardModule
  ],
  templateUrl: './create-issue.component.html',
  styleUrls: ['./create-issue.component.scss']
})
export class CreateIssueComponent {
  issueForm: FormGroup;
  isLoading = false;
  fileList: NzUploadFile[] = [];
  selectedFile: File | undefined;
  priorities = Object.values(Priority);

  constructor(
    private fb: FormBuilder,
    private issueService: IssueService,
    private router: Router,
    private message: NzMessageService
  ) {
    this.issueForm = this.fb.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      priority: ['MEDIUM', [Validators.required]]
    });
  }

  beforeUpload = (file: NzUploadFile): boolean => {
    this.fileList = this.fileList.concat(file);
    this.selectedFile = file as unknown as File;
    return false; // Prevent automatic upload
  };

  submitForm(): void {
    if (this.issueForm.valid) {
      this.isLoading = true;
      this.issueService.createIssue(this.issueForm.value, this.selectedFile).subscribe({
        next: () => {
          this.message.success('Issue reported successfully');
          this.router.navigate(['/issues']);
        },
        error: (err) => {
          this.message.error(err.error?.message || 'Failed to report issue');
          this.isLoading = false;
        }
      });
    } else {
      Object.values(this.issueForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
}
