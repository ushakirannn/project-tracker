import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import { ReleaseService } from '../../../core/services/release.service';
import { ProjectService } from '../../../core/services/project.service';
import { MetricService } from '../../../core/services/metric.service';
import { ApiService } from '../../../core/services/api.service';
import { Project } from '../../../core/models/project.model';
import { Sprint } from '../../../core/models/sprint.model';
import { ProjectMetric } from '../../../core/models/metric.model';

@Component({
  selector: 'app-release-form',
  standalone: true,
  imports: [FormsModule, RouterLink, DecimalPipe],
  templateUrl: './release-form.component.html',
  styleUrl: './release-form.component.css',
})
export class ReleaseFormComponent implements OnInit {
  isEdit = signal(false);
  loading = signal(false);
  releaseId = '';
  saving = signal(false);
  projects = signal<Project[]>([]);
  sprints = signal<Sprint[]>([]);
  projectMetrics = signal<ProjectMetric[]>([]);
  snapshotInputs: { metricId: string; metricName: string; metricUnit: string; previousValue: number | null; currentValue: number | null }[] = [];

  form = {
    project: '',
    sprint: '',
    version: '',
    releaseDate: '',
    description: '',
    changesText: '',
  };

  constructor(
    private releaseService: ReleaseService,
    private projectService: ProjectService,
    private metricService: MetricService,
    private api: ApiService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.projectService.getAll().subscribe(p => this.projects.set(p));
    this.api.get<Sprint[]>('/sprints').subscribe(s => this.sprints.set(s));

    const projectId = this.route.snapshot.queryParams['project'];
    if (projectId) {
      this.form.project = projectId;
      this.loadProjectMetrics(projectId);
    }

    this.releaseId = this.route.snapshot.params['id'];
    if (this.releaseId) {
      this.isEdit.set(true);
      this.loading.set(true);
      this.releaseService.getById(this.releaseId).subscribe({
        next: (release) => {
          this.form = {
            project: release.project?._id || '',
            sprint: release.sprint?._id || '',
            version: release.version,
            releaseDate: new Date(release.releaseDate).toISOString().split('T')[0],
            description: release.description || '',
            changesText: (release.changes || []).join('\n'),
          };
          this.loading.set(false);
          if (this.form.project) {
            this.loadProjectMetrics(this.form.project, this.releaseId);
          }
        },
        error: () => this.loading.set(false),
      });
    } else {
      this.form.releaseDate = new Date().toISOString().split('T')[0];
    }
  }

  onProjectChange(): void {
    if (this.form.project) {
      this.loadProjectMetrics(this.form.project);
    } else {
      this.projectMetrics.set([]);
      this.snapshotInputs = [];
    }
  }

  private loadProjectMetrics(projectId: string, releaseId?: string): void {
    this.metricService.getByProject(projectId).subscribe({
      next: (metrics) => {
        this.projectMetrics.set(metrics);
        this.snapshotInputs = metrics.map(m => ({
          metricId: m._id,
          metricName: m.metricName,
          metricUnit: m.metricUnit,
          previousValue: null,
          currentValue: null,
        }));

        if (releaseId) {
          this.metricService.getSnapshotsByRelease(releaseId).subscribe({
            next: (snapshots) => {
              snapshots.forEach(s => {
                const metricId = typeof s.metric === 'string' ? s.metric : (s.metric as any)._id;
                const input = this.snapshotInputs.find(i => i.metricId === metricId);
                if (input) {
                  input.previousValue = s.previousValue;
                  input.currentValue = s.currentValue;
                }
              });
            },
          });
        }
      },
    });
  }

  onSubmit(): void {
    if (!this.form.project || !this.form.version.trim() || !this.form.releaseDate) return;
    this.saving.set(true);

    const changes = this.form.changesText
      .split('\n')
      .map(c => c.trim())
      .filter(c => c.length > 0);

    const payload: any = {
      project: this.form.project,
      version: this.form.version,
      releaseDate: this.form.releaseDate,
      description: this.form.description,
      changes,
    };
    if (this.form.sprint) payload.sprint = this.form.sprint;

    const request = this.isEdit()
      ? this.releaseService.update(this.releaseId, payload)
      : this.releaseService.create(payload);

    request.subscribe({
      next: (release) => {
        const validSnapshots = this.snapshotInputs
          .filter(s => s.previousValue != null || s.currentValue != null)
          .map(s => ({
            metricId: s.metricId,
            previousValue: s.previousValue || 0,
            currentValue: s.currentValue || 0,
          }));

        if (validSnapshots.length > 0) {
          this.metricService.saveSnapshots(release._id, validSnapshots).subscribe({
            next: () => this.router.navigate(['/releases', release._id]),
            error: () => this.router.navigate(['/releases', release._id]),
          });
        } else {
          this.router.navigate(['/releases', release._id]);
        }
      },
      error: () => this.saving.set(false),
    });
  }
}
