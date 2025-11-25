import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IssueDetailsDrawerComponent } from './issue-details-drawer.component';

describe('IssueDetailsDrawerComponent', () => {
  let component: IssueDetailsDrawerComponent;
  let fixture: ComponentFixture<IssueDetailsDrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IssueDetailsDrawerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IssueDetailsDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
