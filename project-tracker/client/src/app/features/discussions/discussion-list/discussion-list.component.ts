import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { DiscussionService } from '../../../core/services/discussion.service';
import { ProjectService } from '../../../core/services/project.service';
import { Discussion } from '../../../core/models/discussion.model';
import { Project } from '../../../core/models/project.model';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-discussion-list',
  standalone: true,
  imports: [RouterLink, FormsModule, DatePipe, EmptyStateComponent, LoadingSpinnerComponent],
  templateUrl: './discussion-list.component.html',
  styleUrl: './discussion-list.component.css',
})
export class DiscussionListComponent implements OnInit {
  discussions = signal<Discussion[]>([]);
  projects = signal<Project[]>([]);
  loading = signal(true);
  projectFilter = signal('');

  constructor(
    private discussionService: DiscussionService,
    private projectService: ProjectService,
  ) {}

  ngOnInit(): void {
    this.loadDiscussions();
    this.projectService.getAll().subscribe(p => this.projects.set(p));
  }

  loadDiscussions(): void {
    this.loading.set(true);
    const project = this.projectFilter();
    this.discussionService.getAll(project || undefined).subscribe({
      next: (d) => { this.discussions.set(d); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }

  onProjectFilterChange(): void { this.loadDiscussions(); }
}
