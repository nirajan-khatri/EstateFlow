import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzMessageService } from 'ng-zorro-antd/message';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceMock: any;
  let routerMock: any;
  let messageServiceMock: any;

  beforeEach(async () => {
    authServiceMock = {
      login: jasmine.createSpy('login').and.returnValue(of({}))
    };
    routerMock = { navigate: jasmine.createSpy('navigate') };
    messageServiceMock = { error: jasmine.createSpy('error') };

    await TestBed.configureTestingModule({
      imports: [
        LoginComponent,
        ReactiveFormsModule,
        NzFormModule,
        NzInputModule,
        NzButtonModule,
        NzCardModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: NzMessageService, useValue: messageServiceMock }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call login on valid form submission', () => {
    component.loginForm.setValue({ email: 'test@example.com', password: 'password', remember: false });
    component.submitForm();

    expect(authServiceMock.login).toHaveBeenCalledWith({ email: 'test@example.com', password: 'password', remember: false });
    expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should show error message on login failure', () => {
    authServiceMock.login.and.returnValue(throwError(() => ({ error: { message: 'Invalid credentials' } })));
    component.loginForm.setValue({ email: 'test@example.com', password: 'wrong', remember: false });
    component.submitForm();

    expect(messageServiceMock.error).toHaveBeenCalledWith('Invalid credentials');
  });
});
