import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { TaskService } from '../../../core/services/task.service';
import { Task, TaskStatus } from '../../../core/models/task.model';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [RouterLink, DatePipe, StatusBadgeComponent, LoadingSpinnerComponent],
  templateUrl: './task-detail.component.html',
  styleUrl: './task-detail.component.css',
})
export class TaskDetailComponent implements OnInit {
  task = signal<Task | null>(null);
  loading = signal(true);
  showDeleteConfirm = signal(false);

  statusOptions: TaskStatus[] = ['planned', 'in-progress', 'blocked', 'testing', 'completed'];

  constructor(
    private taskService: TaskService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    this.taskService.getById(id).subscribe({
      next: (task) => {
        this.task.set(task);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.router.navigate(['/tasks']);
      },
    });
  }

  quickStatusUpdate(status: string): void {
    const task = this.task();
    if (!task) return;
    this.taskService.updateStatus(task._id, status).subscribe({
      next: (updated) => this.task.set(updated),
    });
  }

  confirmDelete(): void {
    this.showDeleteConfirm.set(true);
  }

  cancelDelete(): void {
    this.showDeleteConfirm.set(false);
  }

  deleteTask(): void {
    const task = this.task();
    if (!task) return;
    this.taskService.delete(task._id).subscribe({
      next: () => this.router.navigate(['/tasks']),
    });
  }
}
