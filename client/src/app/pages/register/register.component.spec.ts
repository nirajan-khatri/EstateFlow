import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzMessageService } from 'ng-zorro-antd/message';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authServiceMock: any;
  let routerMock: any;
  let messageServiceMock: any;

  beforeEach(async () => {
    authServiceMock = {
      register: jasmine.createSpy('register').and.returnValue(of({}))
    };
    routerMock = { navigate: jasmine.createSpy('navigate') };
    messageServiceMock = { error: jasmine.createSpy('error') };

    await TestBed.configureTestingModule({
      imports: [
        RegisterComponent,
        ReactiveFormsModule,
        NzFormModule,
        NzInputModule,
        NzButtonModule,
        NzCardModule,
        NzSelectModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: NzMessageService, useValue: messageServiceMock }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call register on valid form submission', () => {
    component.registerForm.setValue({ name: 'Test User', email: 'test@example.com', password: 'password', role: 'EMPLOYEE' });
    component.submitForm();

    expect(authServiceMock.register).toHaveBeenCalledWith({ name: 'Test User', email: 'test@example.com', password: 'password', role: 'EMPLOYEE' });
    expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should show error message on registration failure', () => {
    authServiceMock.register.and.returnValue(throwError(() => ({ error: { message: 'Registration failed' } })));
    component.registerForm.setValue({ name: 'Test User', email: 'test@example.com', password: 'password', role: 'EMPLOYEE' });
    component.submitForm();

    expect(messageServiceMock.error).toHaveBeenCalledWith('Registration failed');
  });
});
