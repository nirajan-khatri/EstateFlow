import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { IssueService } from './issue.service';
import { Issue, Priority, IssueStatus } from '../../models/issue.model';

describe('IssueService', () => {
  let service: IssueService;
  let httpMock: HttpTestingController;

  const mockIssues: Issue[] = [
    {
      id: '1',
      title: 'Test Issue 1',
      description: 'Description 1',
      priority: Priority.HIGH,
      status: IssueStatus.OPEN,
      reporterId: 'user1',
      assigneeId: 'user2',
      createdAt: new Date(),
      updatedAt: new Date(),
      images: []
    },
    {
      id: '2',
      title: 'Test Issue 2',
      description: 'Description 2',
      priority: Priority.LOW,
      status: IssueStatus.IN_PROGRESS,
      reporterId: 'user1',
      assigneeId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      images: []
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [IssueService]
    });
    service = TestBed.inject(IssueService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch my issues and update signal', () => {
    service.getMyIssues().subscribe();

    const req = httpMock.expectOne('http://localhost:3000/api/issues');
    expect(req.request.method).toBe('GET');
    req.flush(mockIssues);

    expect(service.issues().length).toBe(2);
    expect(service.issues()).toEqual(mockIssues);
  });

  it('should fetch assigned issues', () => {
    service.getAssignedIssues().subscribe(issues => {
      expect(issues.length).toBe(2);
      expect(issues).toEqual(mockIssues);
    });

    const req = httpMock.expectOne('http://localhost:3000/api/issues/assigned');
    expect(req.request.method).toBe('GET');
    req.flush(mockIssues);
  });

  it('should create an issue and update signal', () => {
    const newIssue: Issue = { ...mockIssues[0], id: '3', title: 'New Issue' };
    const issueData = { title: 'New Issue', description: 'Desc', priority: Priority.MEDIUM };

    service.createIssue(issueData, []).subscribe();

    const req = httpMock.expectOne('http://localhost:3000/api/issues');
    expect(req.request.method).toBe('POST');
    req.flush(newIssue);

    // Note: createIssue updates the signal by prepending the new issue
    // We need to ensure the signal was updated. Since we didn't load initial issues in this test,
    // the signal should contain just the new issue (or appended if others existed).
    // However, createIssue implementation: this.issuesSignal.update(issues => [newIssue, ...issues]);
    // So if signal was empty, it should be [newIssue].
    expect(service.issues().length).toBe(1);
    expect(service.issues()[0]).toEqual(newIssue);
  });

  it('should update status and update signal', () => {
    // First load issues to populate signal
    service.getMyIssues().subscribe();
    httpMock.expectOne('http://localhost:3000/api/issues').flush(mockIssues);

    const updatedIssue = { ...mockIssues[0], status: IssueStatus.RESOLVED };

    service.updateStatus('1', IssueStatus.RESOLVED).subscribe();

    const req = httpMock.expectOne('http://localhost:3000/api/issues/1/status');
    expect(req.request.method).toBe('PATCH');
    req.flush(updatedIssue);

    const issues = service.issues();
    const issue = issues.find(i => i.id === '1');
    expect(issue?.status).toBe(IssueStatus.RESOLVED);
  });
});
