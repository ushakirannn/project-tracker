import { Routes } from '@angular/router';

export const discussionsRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./discussion-list/discussion-list.component').then(m => m.DiscussionListComponent),
  },
  {
    path: 'new',
    loadComponent: () => import('./discussion-form/discussion-form.component').then(m => m.DiscussionFormComponent),
  },
  {
    path: ':id',
    loadComponent: () => import('./discussion-detail/discussion-detail.component').then(m => m.DiscussionDetailComponent),
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./discussion-form/discussion-form.component').then(m => m.DiscussionFormComponent),
  },
];
