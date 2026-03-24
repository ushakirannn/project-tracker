import { Routes } from '@angular/router';

export const tasksRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./task-list/task-list.component').then(m => m.TaskListComponent),
  },
  {
    path: 'board',
    loadComponent: () => import('./task-board/task-board.component').then(m => m.TaskBoardComponent),
  },
  {
    path: 'new',
    loadComponent: () => import('./task-form/task-form.component').then(m => m.TaskFormComponent),
  },
  {
    path: ':id',
    loadComponent: () => import('./task-detail/task-detail.component').then(m => m.TaskDetailComponent),
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./task-form/task-form.component').then(m => m.TaskFormComponent),
  },
];
