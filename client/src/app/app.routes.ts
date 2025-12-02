import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: '', redirectTo: '/issues', pathMatch: 'full' },
    {
        path: 'issues',
        canActivate: [authGuard],
        children: [
            {
                path: '',
                loadComponent: () => import('./pages/issue-list/issue-list.component').then(m => m.IssueListComponent)
            },
            {
                path: 'create',
                loadComponent: () => import('./pages/create-issue/create-issue.component').then(m => m.CreateIssueComponent)
            },
            {
                path: 'assigned',
                loadComponent: () => import('./pages/assigned-issues/assigned-issues.component').then(m => m.AssignedIssuesComponent)
            }
        ]
    },
    {
        path: 'dashboard',
        loadComponent: () => import('./pages/manager-dashboard/manager-dashboard.component').then(m => m.ManagerDashboardComponent),
        canActivate: [authGuard, roleGuard],
        data: { expectedRole: 'MANAGER' }
    }
];
