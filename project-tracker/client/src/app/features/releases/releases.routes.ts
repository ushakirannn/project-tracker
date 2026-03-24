import { Routes } from '@angular/router';

export const releasesRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./release-list/release-list.component').then(m => m.ReleaseListComponent),
  },
  {
    path: 'new',
    loadComponent: () => import('./release-form/release-form.component').then(m => m.ReleaseFormComponent),
  },
  {
    path: ':id',
    loadComponent: () => import('./release-detail/release-detail.component').then(m => m.ReleaseDetailComponent),
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./release-form/release-form.component').then(m => m.ReleaseFormComponent),
  },
];
