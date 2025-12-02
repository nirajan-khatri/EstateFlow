import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NzMessageService } from 'ng-zorro-antd/message';

export const roleGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const message = inject(NzMessageService);

    const expectedRole = route.data['expectedRole'];

    if (authService.isAuthenticated() && authService.hasRole(expectedRole)) {
        return true;
    }

    message.error('You do not have permission to access this page');
    // Redirect to a safe page, e.g., issues list
    router.navigate(['/issues']);
    return false;
};
