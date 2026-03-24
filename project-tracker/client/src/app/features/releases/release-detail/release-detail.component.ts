import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ReleaseService } from '../../../core/services/release.service';
import { MetricService } from '../../../core/services/metric.service';
import { Release } from '../../../core/models/release.model';
import { MetricSnapshot } from '../../../core/models/metric.model';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-release-detail',
  standalone: true,
  imports: [RouterLink, DatePipe, LoadingSpinnerComponent],
  templateUrl: './release-detail.component.html',
  styleUrl: './release-detail.component.css',
})
export class ReleaseDetailComponent implements OnInit {
  release = signal<Release | null>(null);
  snapshots = signal<MetricSnapshot[]>([]);
  loading = signal(true);
  showDeleteConfirm = signal(false);

  constructor(
    private releaseService: ReleaseService,
    private metricService: MetricService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    this.releaseService.getById(id).subscribe({
      next: (release) => {
        this.release.set(release);
        this.loading.set(false);
        this.metricService.getSnapshotsByRelease(id).subscribe({
          next: (snapshots) => this.snapshots.set(snapshots),
        });
      },
      error: () => {
        this.loading.set(false);
        this.router.navigate(['/releases']);
      },
    });
  }

  confirmDelete(): void { this.showDeleteConfirm.set(true); }
  cancelDelete(): void { this.showDeleteConfirm.set(false); }

  deleteRelease(): void {
    const release = this.release();
    if (!release) return;
    this.releaseService.delete(release._id).subscribe({
      next: () => this.router.navigate(['/releases']),
    });
  }
}
