import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IssueListComponent } from './issue-list.component';
import { IssueService } from '../../core/services/issue.service';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { signal } from '@angular/core';

describe('IssueListComponent', () => {
  let component: IssueListComponent;
  let fixture: ComponentFixture<IssueListComponent>;
  let issueServiceMock: any;

  beforeEach(async () => {
    issueServiceMock = {
      getMyIssues: jasmine.createSpy('getMyIssues').and.returnValue(of([])),
      issues: signal([]),
      loading: signal(false),
      error: signal(null)
    };

    await TestBed.configureTestingModule({
      imports: [
        IssueListComponent,
        NzTableModule,
        NzTagModule,
        NzButtonModule,
        NzIconModule,
        NzCardModule,
        NzEmptyModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: IssueService, useValue: issueServiceMock }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(IssueListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch issues on init', () => {
    expect(issueServiceMock.getMyIssues).toHaveBeenCalled();
  });
});
