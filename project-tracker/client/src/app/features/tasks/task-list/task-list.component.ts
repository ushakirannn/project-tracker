import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { TaskService, TaskFilters } from '../../../core/services/task.service';
import { ProjectService } from '../../../core/services/project.service';
import { ApiService } from '../../../core/services/api.service';
import { Task } from '../../../core/models/task.model';
import { Project } from '../../../core/models/project.model';
import { User } from '../../../core/models/user.model';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [RouterLink, FormsModule, DatePipe, StatusBadgeComponent, EmptyStateComponent, LoadingSpinnerComponent],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css',
})
export class TaskListComponent implements OnInit {
  tasks = signal<Task[]>([]);
  projects = signal<Project[]>([]);
  users = signal<User[]>([]);
  loading = signal(true);

  filters: TaskFilters = {};

  statusOptions = ['', 'planned', 'in-progress', 'blocked', 'testing', 'completed'];
  priorityOptions = ['', 'low', 'medium', 'high', 'critical'];
  categoryOptions = ['', 'feature', 'bug', 'improvement', 'research', 'maintenance'];

  constructor(
    private taskService: TaskService,
    private projectService: ProjectService,
    private apiService: ApiService,
  ) {}

  ngOnInit(): void {
    this.loadTasks();
    this.projectService.getAll().subscribe(p => this.projects.set(p));
    this.apiService.get<User[]>('/auth/users').subscribe(u => this.users.set(u));
  }

  loadTasks(): void {
    this.loading.set(true);
    this.taskService.getAll(this.filters).subscribe({
      next: (tasks) => {
        this.tasks.set(tasks);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  onFilterChange(): void {
    this.loadTasks();
  }

  clearFilters(): void {
    this.filters = {};
    this.loadTasks();
  }

  hasActiveFilters(): boolean {
    return Object.values(this.filters).some(v => !!v);
  }
}
