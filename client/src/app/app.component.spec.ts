import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { AuthService } from './core/services/auth.service';
import { RouterTestingModule } from '@angular/router/testing';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { of } from 'rxjs';

describe('AppComponent', () => {
  let authServiceMock: any;

  beforeEach(async () => {
    authServiceMock = {
      currentUser$: of(null), // Start with no user
      logout: jasmine.createSpy('logout')
    };

    await TestBed.configureTestingModule({
      imports: [
        AppComponent,
        RouterTestingModule,
        NzLayoutModule,
        NzMenuModule,
        NzAvatarModule,
        NzDropDownModule,
        NzIconModule
      ],
      providers: [
        { provide: AuthService, useValue: authServiceMock }
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have the 'EstateFlow' branding when user is logged in`, () => {
    authServiceMock.currentUser$ = of({ name: 'Test User', role: 'EMPLOYEE' });
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.app-name')?.textContent).toContain('EstateFlow');
  });
});
