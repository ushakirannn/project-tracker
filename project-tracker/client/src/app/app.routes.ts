import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: 'login', loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent) },
  { path: 'auth/callback', loadComponent: () => import('./features/auth/callback/auth-callback.component').then(m => m.AuthCallbackComponent) },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
  },
  {
    path: 'projects',
    canActivate: [authGuard],
    loadChildren: () => import('./features/projects/projects.routes').then(m => m.projectsRoutes),
  },
  {
    path: 'tasks',
    canActivate: [authGuard],
    loadChildren: () => import('./features/tasks/tasks.routes').then(m => m.tasksRoutes),
  },
  {
    path: 'sprints',
    canActivate: [authGuard],
    loadChildren: () => import('./features/sprints/sprints.routes').then(m => m.sprintsRoutes),
  },
  {
    path: 'releases',
    canActivate: [authGuard],
    loadChildren: () => import('./features/releases/releases.routes').then(m => m.releasesRoutes),
  },
  {
    path: 'discussions',
    canActivate: [authGuard],
    loadChildren: () => import('./features/discussions/discussions.routes').then(m => m.discussionsRoutes),
  },
  {
    path: 'activity',
    canActivate: [authGuard],
    loadChildren: () => import('./features/activity/activity.routes').then(m => m.activityRoutes),
  },
  {
    path: 'search',
    canActivate: [authGuard],
    loadChildren: () => import('./features/search/search.routes').then(m => m.searchRoutes),
  },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: 'dashboard' },
];
