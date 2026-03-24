import { Routes } from '@angular/router';

export const searchRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./search.component').then(m => m.SearchComponent),
  },
];
