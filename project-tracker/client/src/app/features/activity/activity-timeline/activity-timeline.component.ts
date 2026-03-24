import { Component, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { Activity } from '../../../core/models/activity.model';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-activity-timeline',
  standalone: true,
  imports: [DatePipe, RouterLink, FormsModule, LoadingSpinnerComponent, EmptyStateComponent],
  templateUrl: './activity-timeline.component.html',
  styleUrl: './activity-timeline.component.css',
})
export class ActivityTimelineComponent implements OnInit {
  activities = signal<Activity[]>([]);
  loading = signal(true);

  filterEntityType = '';
  filterLimit = '50';

  entityTypes = ['project', 'task', 'sprint', 'release', 'discussion', 'comment'];

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.loadActivities();
  }

  loadActivities(): void {
    this.loading.set(true);
    const params: Record<string, string> = {};
    if (this.filterEntityType) params['entityType'] = this.filterEntityType;
    params['limit'] = this.filterLimit;

    this.api.get<Activity[]>('/activities', params).subscribe({
      next: (activities) => {
        this.activities.set(activities);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  getIcon(type: string): string {
    const icons: Record<string, string> = {
      project: 'PRJ',
      task: 'TSK',
      sprint: 'SPR',
      release: 'REL',
      discussion: 'DSC',
      comment: 'CMT',
    };
    return icons[type] || '?';
  }

  getEntityRoute(activity: Activity): string[] | null {
    const routes: Record<string, string> = {
      project: '/projects',
      task: '/tasks',
      sprint: '/sprints',
      release: '/releases',
      discussion: '/discussions',
    };
    const base = routes[activity.entityType];
    if (base && activity.entityId) {
      return [base, activity.entityId];
    }
    return null;
  }
}
