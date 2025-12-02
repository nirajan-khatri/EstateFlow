import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { DashboardService } from '../../core/services/dashboard.service';
import { SocketService } from '../../core/services/socket.service';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { FormsModule } from '@angular/forms';
import { BaseChartDirective } from 'ng2-charts';
import { of } from 'rxjs';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let dashboardServiceMock: any;
  let socketServiceMock: any;

  beforeEach(async () => {
    dashboardServiceMock = {
      getStats: jasmine.createSpy('getStats').and.returnValue(of({
        statusCounts: [],
        priorityCounts: [],
        recentIssues: []
      }))
    };
    socketServiceMock = {
      on: jasmine.createSpy('on').and.returnValue(of({}))
    };

    await TestBed.configureTestingModule({
      imports: [
        DashboardComponent,
        NzCardModule,
        NzStatisticModule,
        NzGridModule,
        NzTableModule,
        NzTagModule,
        NzButtonModule,
        NzDatePickerModule,
        FormsModule,
        BaseChartDirective
      ],
      providers: [
        { provide: DashboardService, useValue: dashboardServiceMock },
        { provide: SocketService, useValue: socketServiceMock }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load stats on init', () => {
    expect(dashboardServiceMock.getStats).toHaveBeenCalled();
  });

  it('should setup realtime updates', () => {
    expect(socketServiceMock.on).toHaveBeenCalledWith('issue:created');
    expect(socketServiceMock.on).toHaveBeenCalledWith('issue:assigned');
    expect(socketServiceMock.on).toHaveBeenCalledWith('issue:status_change');
  });
});
