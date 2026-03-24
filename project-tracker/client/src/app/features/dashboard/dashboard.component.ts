import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { Activity } from '../../core/models/activity.model';
import { Task } from '../../core/models/task.model';
import { RoadmapItem } from '../../core/models/roadmap.model';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';

interface DashboardStats {
  projects: { total: number; active: number; completed: number };
  tasks: { total: number; planned: number; inProgress: number; blocked: number; testing: number; completed: number };
  currentSprint: {
    sprint: { _id: string; name: string; startDate: string; endDate: string };
    total: number;
    completed: number;
    inProgress: number;
    blocked: number;
    planned: number;
    testing: number;
    progress: number;
  } | null;
}

interface ProjectOverview {
  _id: string;
  name: string;
  status: string;
  currentFocus: string | null;
  openTasks: number;
  currentSprint: string | null;
  lastRelease: string | null;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, DatePipe, LoadingSpinnerComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  stats = signal<DashboardStats | null>(null);
  projectsOverview = signal<ProjectOverview[]>([]);
  myTasks = signal<Task[]>([]);
  upcomingDeadlines = signal<Task[]>([]);
  upcomingRoadmap = signal<RoadmapItem[]>([]);
  activities = signal<Activity[]>([]);
  loading = signal(true);

  constructor(
    private api: ApiService,
    public authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.api.get<DashboardStats>('/dashboard/stats').subscribe({
      next: (stats) => {
        this.stats.set(stats);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });

    this.api.get<ProjectOverview[]>('/dashboard/projects-overview').subscribe({
      next: (projects) => this.projectsOverview.set(projects),
    });

    this.api.get<Task[]>('/dashboard/my-tasks').subscribe({
      next: (tasks) => this.myTasks.set(tasks),
    });

    this.api.get<Task[]>('/dashboard/upcoming-deadlines').subscribe({
      next: (tasks) => this.upcomingDeadlines.set(tasks),
    });

    this.api.get<RoadmapItem[]>('/roadmap/upcoming').subscribe({
      next: (items) => this.upcomingRoadmap.set(items),
    });

    this.api.get<Activity[]>('/dashboard/recent').subscribe({
      next: (activities) => this.activities.set(activities),
    });
  }

  getPriorityClass(priority: string): string {
    const map: Record<string, string> = {
      critical: 'priority-critical',
      high: 'priority-high',
      medium: 'priority-medium',
      low: 'priority-low',
    };
    return map[priority] || '';
  }

  getDeadlineClass(deadline: string | Date | undefined): string {
    if (!deadline) return '';
    const now = new Date();
    const dl = new Date(deadline);
    const diffDays = (dl.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    if (diffDays < 0) return 'deadline-overdue';
    if (diffDays <= 2) return 'deadline-soon';
    return '';
  }

  getStatusClass(status: string): string {
    const map: Record<string, string> = {
      active: 'status-active',
      'on-hold': 'status-on-hold',
      completed: 'status-completed',
      archived: 'status-archived',
    };
    return map[status] || '';
  }

  getStatusLabel(status: string): string {
    const map: Record<string, string> = {
      active: 'Active',
      'on-hold': 'On Hold',
      completed: 'Completed',
      archived: 'Archived',
    };
    return map[status] || status;
  }

  getRoadmapStatusClass(status: string): string {
    const map: Record<string, string> = {
      planned: 'roadmap-planned',
      in_progress: 'roadmap-in-progress',
      completed: 'roadmap-completed',
      delayed: 'roadmap-delayed',
    };
    return map[status] || '';
  }

  getRoadmapStatusLabel(status: string): string {
    const map: Record<string, string> = {
      planned: 'Planned',
      in_progress: 'In Progress',
      completed: 'Completed',
      delayed: 'Delayed',
    };
    return map[status] || status;
  }

  getActivityIcon(type: string): string {
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
}
