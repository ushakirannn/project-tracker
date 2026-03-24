import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { SprintService } from '../../../core/services/sprint.service';
import { Sprint } from '../../../core/models/sprint.model';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-sprint-list',
  standalone: true,
  imports: [RouterLink, DatePipe, StatusBadgeComponent, EmptyStateComponent, LoadingSpinnerComponent],
  templateUrl: './sprint-list.component.html',
  styleUrl: './sprint-list.component.css',
})
export class SprintListComponent implements OnInit {
  sprints = signal<Sprint[]>([]);
  loading = signal(true);
  activeFilter = signal('');

  statusOptions = ['', 'planning', 'active', 'completed'];

  constructor(private sprintService: SprintService) {}

  ngOnInit(): void {
    this.loadSprints();
  }

  loadSprints(): void {
    this.loading.set(true);
    const status = this.activeFilter();
    this.sprintService.getAll(status || undefined).subscribe({
      next: (sprints) => {
        this.sprints.set(sprints);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  filterByStatus(status: string): void {
    this.activeFilter.set(status);
    this.loadSprints();
  }

  getDuration(sprint: Sprint): number {
    const start = new Date(sprint.startDate).getTime();
    const end = new Date(sprint.endDate).getTime();
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  }
}
