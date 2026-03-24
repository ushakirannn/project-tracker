import { Routes } from '@angular/router';

export const activityRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./activity-timeline/activity-timeline.component').then(m => m.ActivityTimelineComponent),
  },
];
