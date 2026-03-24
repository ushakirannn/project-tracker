import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';

interface SearchResults {
  projects: any[];
  tasks: any[];
  discussions: any[];
  releases: any[];
}

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [RouterLink, FormsModule, DatePipe, StatusBadgeComponent, LoadingSpinnerComponent, EmptyStateComponent],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css',
})
export class SearchComponent implements OnInit, OnDestroy {
  query = '';
  results = signal<SearchResults | null>(null);
  loading = signal(false);
  private keyHandler = this.onKeyDown.bind(this);

  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const q = this.route.snapshot.queryParams['q'];
    if (q) {
      this.query = q;
      this.search();
    }
    document.addEventListener('keydown', this.keyHandler);
  }

  ngOnDestroy(): void {
    document.removeEventListener('keydown', this.keyHandler);
  }

  private onKeyDown(e: KeyboardEvent): void {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      const input = document.getElementById('search-input') as HTMLInputElement;
      input?.focus();
    }
  }

  search(): void {
    if (!this.query || this.query.trim().length < 2) return;
    this.loading.set(true);
    this.router.navigate([], { queryParams: { q: this.query }, queryParamsHandling: 'merge' });

    this.api.get<SearchResults>('/search', { q: this.query }).subscribe({
      next: (results) => {
        this.results.set(results);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  get totalResults(): number {
    const r = this.results();
    if (!r) return 0;
    return r.projects.length + r.tasks.length + r.discussions.length + r.releases.length;
  }
}
