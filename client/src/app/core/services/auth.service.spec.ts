import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService, User } from './auth.service';
import { Router } from '@angular/router';
import { SocketService } from './socket.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let routerMock: any;
  let socketServiceMock: any;

  const mockUser: User = {
    id: '1',
    email: 'test@example.com',
    name: 'Test User',
    role: 'EMPLOYEE'
  };

  const mockAuthResponse = {
    message: 'Success',
    token: 'fake-jwt-token',
    user: mockUser
  };

  beforeEach(() => {
    routerMock = { navigate: jasmine.createSpy('navigate') };
    socketServiceMock = { connect: jasmine.createSpy('connect'), disconnect: jasmine.createSpy('disconnect') };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: Router, useValue: routerMock },
        { provide: SocketService, useValue: socketServiceMock }
      ]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);

    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login and update currentUser subject', () => {
    service.login({ email: 'test@example.com', password: 'password' }).subscribe(response => {
      expect(response).toEqual(mockAuthResponse);
    });

    const req = httpMock.expectOne('http://localhost:3000/api/auth/login');
    expect(req.request.method).toBe('POST');
    req.flush(mockAuthResponse);

    service.currentUser$.subscribe(user => {
      expect(user).toEqual(mockUser);
    });
    expect(localStorage.getItem('token')).toBe('fake-jwt-token');
    expect(socketServiceMock.connect).toHaveBeenCalledWith(mockUser.id);
  });

  it('should register and update currentUser subject', () => {
    service.register({ name: 'Test User', email: 'test@example.com', password: 'password', role: 'EMPLOYEE' }).subscribe(response => {
      expect(response).toEqual(mockAuthResponse);
    });

    const req = httpMock.expectOne('http://localhost:3000/api/auth/register');
    expect(req.request.method).toBe('POST');
    req.flush(mockAuthResponse);

    service.currentUser$.subscribe(user => {
      expect(user).toEqual(mockUser);
    });
    expect(localStorage.getItem('token')).toBe('fake-jwt-token');
    expect(socketServiceMock.connect).toHaveBeenCalledWith(mockUser.id);
  });

  it('should logout and clear currentUser subject', () => {
    localStorage.setItem('token', 'fake-jwt-token');
    service.logout();

    service.currentUser$.subscribe(user => {
      expect(user).toBeNull();
    });
    expect(localStorage.getItem('token')).toBeNull();
    expect(socketServiceMock.disconnect).toHaveBeenCalled();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
  });
});
