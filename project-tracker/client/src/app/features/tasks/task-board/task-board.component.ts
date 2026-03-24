import { Component, OnInit, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../../core/services/task.service';
import { ProjectService } from '../../../core/services/project.service';
import { Task, TaskStatus } from '../../../core/models/task.model';
import { Project } from '../../../core/models/project.model';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

interface BoardColumn {
  status: TaskStatus;
  label: string;
  color: string;
}

@Component({
  selector: 'app-task-board',
  standalone: true,
  imports: [RouterLink, FormsModule, StatusBadgeComponent, LoadingSpinnerComponent],
  templateUrl: './task-board.component.html',
  styleUrl: './task-board.component.css',
})
export class TaskBoardComponent implements OnInit {
  allTasks = signal<Task[]>([]);
  projects = signal<Project[]>([]);
  loading = signal(true);
  projectFilter = signal('');

  columns: BoardColumn[] = [
    { status: 'planned', label: 'Planned', color: '#64748b' },
    { status: 'in-progress', label: 'In Progress', color: '#2563eb' },
    { status: 'blocked', label: 'Blocked', color: '#dc2626' },
    { status: 'testing', label: 'Testing', color: '#f59e0b' },
    { status: 'completed', label: 'Completed', color: '#16a34a' },
  ];

  constructor(
    private taskService: TaskService,
    private projectService: ProjectService,
  ) {}

  ngOnInit(): void {
    this.loadTasks();
    this.projectService.getAll().subscribe(p => this.projects.set(p));
  }

  loadTasks(): void {
    this.loading.set(true);
    const filters: any = {};
    if (this.projectFilter()) filters.project = this.projectFilter();

    this.taskService.getAll(filters).subscribe({
      next: (tasks) => {
        this.allTasks.set(tasks);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  getTasksForColumn(status: TaskStatus): Task[] {
    return this.allTasks().filter(t => t.status === status);
  }

  onProjectFilterChange(): void {
    this.loadTasks();
  }

  moveTask(task: Task, newStatus: TaskStatus): void {
    this.taskService.updateStatus(task._id, newStatus).subscribe({
      next: (updated) => {
        const tasks = this.allTasks().map(t => t._id === updated._id ? updated : t);
        this.allTasks.set(tasks);
      },
    });
  }

  onDragStart(event: DragEvent, task: Task): void {
    event.dataTransfer?.setData('taskId', task._id);
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  onDrop(event: DragEvent, status: TaskStatus): void {
    event.preventDefault();
    const taskId = event.dataTransfer?.getData('taskId');
    if (!taskId) return;

    const task = this.allTasks().find(t => t._id === taskId);
    if (task && task.status !== status) {
      this.moveTask(task, status);
    }
  }
}
