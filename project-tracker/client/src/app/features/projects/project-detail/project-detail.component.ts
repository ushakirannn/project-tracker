import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProjectService } from '../../../core/services/project.service';
import { TaskService, TaskFilters } from '../../../core/services/task.service';
import { ReleaseService } from '../../../core/services/release.service';
import { DiscussionService } from '../../../core/services/discussion.service';
import { ApiService } from '../../../core/services/api.service';
import { Project } from '../../../core/models/project.model';
import { Task } from '../../../core/models/task.model';
import { Release } from '../../../core/models/release.model';
import { Discussion } from '../../../core/models/discussion.model';
import { Activity } from '../../../core/models/activity.model';
import { User } from '../../../core/models/user.model';
import { ProjectMetric } from '../../../core/models/metric.model';
import { MetricService } from '../../../core/services/metric.service';
import { RoadmapItem } from '../../../core/models/roadmap.model';
import { RoadmapService } from '../../../core/services/roadmap.service';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [RouterLink, DatePipe, FormsModule, StatusBadgeComponent, LoadingSpinnerComponent, EmptyStateComponent],
  templateUrl: './project-detail.component.html',
  styleUrl: './project-detail.component.css',
})
export class ProjectDetailComponent implements OnInit {
  project = signal<Project | null>(null);
  tasks = signal<Task[]>([]);
  releases = signal<Release[]>([]);
  discussions = signal<Discussion[]>([]);
  activities = signal<Activity[]>([]);
  metrics = signal<ProjectMetric[]>([]);
  roadmapItems = signal<RoadmapItem[]>([]);
  loading = signal(true);
  activeTab = signal<string>('overview');
  activeRoadmapItem = signal<RoadmapItem | null>(null);
  latestRelease = signal<Release | null>(null);
  showDeleteConfirm = signal(false);
  editingFocus = signal(false);
  focusText = '';

  // Roadmap
  showAddRoadmap = signal(false);
  expandedRoadmapId = signal<string | null>(null);
  editingRoadmapId = signal<string | null>(null);
  newRoadmap = { title: '', description: '', priority: 'medium', startDate: '', targetDate: '' };
  editRoadmap = { title: '', description: '', priority: '', startDate: '', targetDate: '' };

  // Metrics
  showAddMetric = signal(false);
  editingMetricId = signal<string | null>(null);
  recordingMetricId = signal<string | null>(null);
  expandedMetricId = signal<string | null>(null);
  metricHistory = signal<any[]>([]);
  newMetric = { metricName: '', metricUnit: '' };
  editMetric = { metricName: '', metricUnit: '' };
  recordValue = { previousValue: 0, currentValue: 0, note: '' };

  // Task filters
  users = signal<User[]>([]);
  taskFilters: TaskFilters = {};
  statusOptions = ['', 'planned', 'in-progress', 'blocked', 'testing', 'completed'];
  priorityOptions = ['', 'low', 'medium', 'high', 'critical'];
  categoryOptions = ['', 'feature', 'bug', 'improvement', 'research', 'maintenance'];

  tabs = ['overview', 'tasks', 'releases', 'discussions', 'metrics', 'roadmap', 'activity'];

  private projectId = '';
  private tabDataLoaded: Record<string, boolean> = {};

  constructor(
    private projectService: ProjectService,
    private taskService: TaskService,
    private releaseService: ReleaseService,
    private discussionService: DiscussionService,
    private metricService: MetricService,
    private roadmapService: RoadmapService,
    private api: ApiService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.projectId = this.route.snapshot.params['id'];
    this.projectService.getById(this.projectId).subscribe({
      next: (project) => {
        this.project.set(project);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.router.navigate(['/projects']);
      },
    });

    // Load active roadmap item for overview
    this.roadmapService.getByProject(this.projectId).subscribe({
      next: (items) => {
        const active = items.find(i => i.status === 'in_progress') || null;
        this.activeRoadmapItem.set(active);
      },
    });

    // Load latest release for overview
    this.releaseService.getByProject(this.projectId).subscribe({
      next: (releases) => {
        if (releases.length) this.latestRelease.set(releases[0]);
      },
    });
  }

  setTab(tab: string): void {
    this.activeTab.set(tab);
    if (this.tabDataLoaded[tab]) return;

    if (tab === 'tasks') {
      this.loadTasks();
      if (this.users().length === 0) {
        this.api.get<User[]>('/auth/users').subscribe(u => this.users.set(u));
      }
    }
    else if (tab === 'releases') this.loadReleases();
    else if (tab === 'discussions') this.loadDiscussions();
    else if (tab === 'metrics') this.loadMetrics();
    else if (tab === 'roadmap') this.loadRoadmap();
    else if (tab === 'activity') this.loadActivities();
  }

  private loadTasks(): void {
    const filters: TaskFilters = { ...this.taskFilters, project: this.projectId };
    this.taskService.getAll(filters).subscribe({
      next: (tasks) => {
        this.tasks.set(tasks);
        this.tabDataLoaded['tasks'] = true;
      },
    });
  }

  onTaskFilterChange(): void {
    this.tabDataLoaded['tasks'] = false;
    this.loadTasks();
  }

  clearTaskFilters(): void {
    this.taskFilters = {};
    this.tabDataLoaded['tasks'] = false;
    this.loadTasks();
  }

  hasActiveTaskFilters(): boolean {
    return Object.values(this.taskFilters).some(v => !!v);
  }

  private loadReleases(): void {
    this.releaseService.getByProject(this.projectId).subscribe({
      next: (releases) => {
        this.releases.set(releases);
        this.tabDataLoaded['releases'] = true;
      },
    });
  }

  private loadDiscussions(): void {
    this.discussionService.getByProject(this.projectId).subscribe({
      next: (discussions) => {
        this.discussions.set(discussions);
        this.tabDataLoaded['discussions'] = true;
      },
    });
  }

  private loadActivities(): void {
    this.api.get<Activity[]>('/activities', { entityType: 'project', entityId: this.projectId }).subscribe({
      next: (activities) => {
        this.activities.set(activities);
        this.tabDataLoaded['activity'] = true;
      },
    });
  }

  private loadMetrics(): void {
    this.metricService.getLatestByProject(this.projectId).subscribe({
      next: (metrics) => {
        this.metrics.set(metrics);
        this.tabDataLoaded['metrics'] = true;
      },
    });
  }

  // Roadmap methods
  private loadRoadmap(): void {
    this.roadmapService.getByProject(this.projectId).subscribe({
      next: (items) => {
        this.roadmapItems.set(items);
        this.tabDataLoaded['roadmap'] = true;
      },
    });
  }

  toggleRoadmapTasks(id: string): void {
    this.expandedRoadmapId.set(this.expandedRoadmapId() === id ? null : id);
  }

  openAddRoadmap(): void {
    this.newRoadmap = { title: '', description: '', priority: 'medium', startDate: '', targetDate: '' };
    this.showAddRoadmap.set(true);
  }

  addRoadmap(): void {
    if (!this.newRoadmap.title.trim()) return;
    const payload: any = { ...this.newRoadmap, project: this.projectId };
    Object.keys(payload).forEach(k => { if (payload[k] === '') delete payload[k]; });
    this.roadmapService.create(payload).subscribe({
      next: () => {
        this.showAddRoadmap.set(false);
        this.tabDataLoaded['roadmap'] = false;
        this.loadRoadmap();
      },
    });
  }

  startEditRoadmap(item: RoadmapItem): void {
    this.editingRoadmapId.set(item._id);
    this.editRoadmap = {
      title: item.title,
      description: item.description || '',
      priority: item.priority,
      startDate: item.startDate ? new Date(item.startDate).toISOString().split('T')[0] : '',
      targetDate: item.targetDate ? new Date(item.targetDate).toISOString().split('T')[0] : '',
    };
  }

  saveEditRoadmap(): void {
    const id = this.editingRoadmapId();
    if (!id) return;
    const payload: any = { ...this.editRoadmap };
    Object.keys(payload).forEach(k => { if (payload[k] === '') delete payload[k]; });
    this.roadmapService.update(id, payload).subscribe({
      next: () => {
        this.editingRoadmapId.set(null);
        this.tabDataLoaded['roadmap'] = false;
        this.loadRoadmap();
      },
    });
  }

  cancelEditRoadmap(): void {
    this.editingRoadmapId.set(null);
  }

  overrideRoadmapStatus(item: RoadmapItem, status: string): void {
    this.roadmapService.overrideStatus(item._id, status).subscribe({
      next: () => {
        this.tabDataLoaded['roadmap'] = false;
        this.loadRoadmap();
      },
    });
  }

  clearRoadmapOverride(item: RoadmapItem): void {
    this.roadmapService.clearOverride(item._id).subscribe({
      next: () => {
        this.tabDataLoaded['roadmap'] = false;
        this.loadRoadmap();
      },
    });
  }

  deleteRoadmap(id: string): void {
    this.roadmapService.delete(id).subscribe({
      next: () => {
        this.tabDataLoaded['roadmap'] = false;
        this.loadRoadmap();
      },
    });
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

  getRoadmapPriorityClass(priority: string): string {
    const map: Record<string, string> = {
      critical: 'priority-critical',
      high: 'priority-high',
      medium: 'priority-medium',
      low: 'priority-low',
    };
    return map[priority] || '';
  }

  openAddMetric(): void {
    this.newMetric = { metricName: '', metricUnit: '' };
    this.showAddMetric.set(true);
  }

  addMetric(): void {
    if (!this.newMetric.metricName.trim()) return;
    this.metricService.create(this.projectId, this.newMetric).subscribe({
      next: () => {
        this.showAddMetric.set(false);
        this.tabDataLoaded['metrics'] = false;
        this.loadMetrics();
      },
    });
  }

  startEditMetric(m: ProjectMetric): void {
    this.editingMetricId.set(m._id);
    this.editMetric = { metricName: m.metricName, metricUnit: m.metricUnit };
  }

  saveEditMetric(): void {
    const id = this.editingMetricId();
    if (!id) return;
    this.metricService.update(id, this.editMetric).subscribe({
      next: () => {
        this.editingMetricId.set(null);
        this.tabDataLoaded['metrics'] = false;
        this.loadMetrics();
      },
    });
  }

  cancelEditMetric(): void {
    this.editingMetricId.set(null);
  }

  deleteMetric(id: string): void {
    this.metricService.delete(id).subscribe({
      next: () => {
        this.tabDataLoaded['metrics'] = false;
        this.loadMetrics();
      },
    });
  }

  startRecordValue(m: ProjectMetric): void {
    this.recordingMetricId.set(m._id);
    this.recordValue = {
      previousValue: m.latestSnapshot?.currentValue || 0,
      currentValue: 0,
      note: '',
    };
  }

  cancelRecordValue(): void {
    this.recordingMetricId.set(null);
  }

  saveRecordValue(): void {
    const id = this.recordingMetricId();
    if (!id) return;
    this.metricService.createSnapshot({
      metricId: id,
      previousValue: this.recordValue.previousValue,
      currentValue: this.recordValue.currentValue,
      note: this.recordValue.note || undefined,
    }).subscribe({
      next: () => {
        this.recordingMetricId.set(null);
        this.tabDataLoaded['metrics'] = false;
        this.loadMetrics();
        // Refresh history if expanded
        if (this.expandedMetricId() === id) {
          this.loadMetricHistory(id);
        }
      },
    });
  }

  getRecordChangePercent(): number | null {
    const prev = this.recordValue.previousValue;
    const curr = this.recordValue.currentValue;
    if (prev === 0) return curr > 0 ? 100 : 0;
    return Math.round(((curr - prev) / prev) * 10000) / 100;
  }

  toggleMetricHistory(metricId: string): void {
    if (this.expandedMetricId() === metricId) {
      this.expandedMetricId.set(null);
      return;
    }
    this.expandedMetricId.set(metricId);
    this.loadMetricHistory(metricId);
  }

  private loadMetricHistory(metricId: string): void {
    this.metricHistory.set([]);
    this.metricService.getSnapshotHistory(metricId).subscribe({
      next: (history) => this.metricHistory.set(history),
    });
  }

  startEditFocus(): void {
    this.focusText = this.project()?.currentFocus || '';
    this.editingFocus.set(true);
  }

  cancelEditFocus(): void {
    this.editingFocus.set(false);
  }

  saveFocus(): void {
    const p = this.project();
    if (!p) return;

    this.projectService.update(p._id, { currentFocus: this.focusText }).subscribe({
      next: (updated) => {
        this.project.set(updated);
        this.editingFocus.set(false);
      },
    });
  }

  confirmDelete(): void {
    this.showDeleteConfirm.set(true);
  }

  cancelDelete(): void {
    this.showDeleteConfirm.set(false);
  }

  deleteProject(): void {
    const project = this.project();
    if (!project) return;

    this.projectService.delete(project._id).subscribe({
      next: () => this.router.navigate(['/projects']),
    });
  }
}
