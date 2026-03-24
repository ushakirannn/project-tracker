import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ReleaseService } from '../../../core/services/release.service';
import { ProjectService } from '../../../core/services/project.service';
import { Release } from '../../../core/models/release.model';
import { Project } from '../../../core/models/project.model';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-release-list',
  standalone: true,
  imports: [RouterLink, FormsModule, DatePipe, EmptyStateComponent, LoadingSpinnerComponent],
  templateUrl: './release-list.component.html',
  styleUrl: './release-list.component.css',
})
export class ReleaseListComponent implements OnInit {
  releases = signal<Release[]>([]);
  projects = signal<Project[]>([]);
  loading = signal(true);
  projectFilter = signal('');

  constructor(
    private releaseService: ReleaseService,
    private projectService: ProjectService,
  ) {}

  ngOnInit(): void {
    this.loadReleases();
    this.projectService.getAll().subscribe(p => this.projects.set(p));
  }

  loadReleases(): void {
    this.loading.set(true);
    const project = this.projectFilter();
    this.releaseService.getAll(project || undefined).subscribe({
      next: (releases) => {
        this.releases.set(releases);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  onProjectFilterChange(): void {
    this.loadReleases();
  }
}
