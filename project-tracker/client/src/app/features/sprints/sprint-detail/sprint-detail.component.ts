import { Component, OnInit, signal, computed } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { SprintService } from '../../../core/services/sprint.service';
import { TaskService } from '../../../core/services/task.service';
import { Sprint } from '../../../core/models/sprint.model';
import { Task, TaskStatus } from '../../../core/models/task.model';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-sprint-detail',
  standalone: true,
  imports: [RouterLink, DatePipe, StatusBadgeComponent, LoadingSpinnerComponent, EmptyStateComponent],
  templateUrl: './sprint-detail.component.html',
  styleUrl: './sprint-detail.component.css',
})
export class SprintDetailComponent implements OnInit {
  sprint = signal<Sprint | null>(null);
  tasks = signal<Task[]>([]);
  loading = signal(true);
  showDeleteConfirm = signal(false);
  viewMode = signal<'list' | 'board'>('board');
  draggedTask: Task | null = null;

  statusGroups: { status: TaskStatus; label: string; color: string }[] = [
    { status: 'planned', label: 'Planned', color: '#64748b' },
    { status: 'in-progress', label: 'In Progress', color: '#2563eb' },
    { status: 'blocked', label: 'Blocked', color: '#dc2626' },
    { status: 'testing', label: 'Testing', color: '#f59e0b' },
    { status: 'completed', label: 'Completed', color: '#16a34a' },
  ];

  stats = computed(() => {
    const t = this.tasks();
    const total = t.length;
    const completed = t.filter(x => x.status === 'completed').length;
    const inProgress = t.filter(x => x.status === 'in-progress').length;
    const blocked = t.filter(x => x.status === 'blocked').length;
    const planned = t.filter(x => x.status === 'planned').length;
    const testing = t.filter(x => x.status === 'testing').length;
    const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, inProgress, blocked, planned, testing, progress };
  });

  constructor(
    private sprintService: SprintService,
    private taskService: TaskService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    this.sprintService.getById(id).subscribe({
      next: ({ sprint, tasks }) => {
        this.sprint.set(sprint);
        this.tasks.set(tasks);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.router.navigate(['/sprints']);
      },
    });
  }

  getTasksByStatus(status: TaskStatus): Task[] {
    return this.tasks().filter(t => t.status === status);
  }

  toggleView(): void {
    this.viewMode.update(v => v === 'list' ? 'board' : 'list');
  }

  onDragStart(task: Task): void {
    this.draggedTask = task;
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  onDrop(event: DragEvent, newStatus: TaskStatus): void {
    event.preventDefault();
    if (!this.draggedTask || this.draggedTask.status === newStatus) {
      this.draggedTask = null;
      return;
    }

    const taskId = this.draggedTask._id;
    const oldStatus = this.draggedTask.status;

    // Optimistic update
    this.tasks.update(tasks =>
      tasks.map(t => t._id === taskId ? { ...t, status: newStatus } : t)
    );
    this.draggedTask = null;

    this.taskService.updateStatus(taskId, newStatus).subscribe({
      error: () => {
        // Revert on error
        this.tasks.update(tasks =>
          tasks.map(t => t._id === taskId ? { ...t, status: oldStatus } : t)
        );
      },
    });
  }

  confirmDelete(): void { this.showDeleteConfirm.set(true); }
  cancelDelete(): void { this.showDeleteConfirm.set(false); }

  deleteSprint(): void {
    const sprint = this.sprint();
    if (!sprint) return;
    this.sprintService.delete(sprint._id).subscribe({
      next: () => this.router.navigate(['/sprints']),
    });
  }
}
