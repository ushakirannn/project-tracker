import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SprintService } from '../../../core/services/sprint.service';

@Component({
  selector: 'app-sprint-form',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './sprint-form.component.html',
  styleUrl: './sprint-form.component.css',
})
export class SprintFormComponent implements OnInit {
  isEdit = signal(false);
  loading = signal(false);
  sprintId = '';
  saving = signal(false);

  form = {
    name: '',
    startDate: '',
    endDate: '',
    status: 'planning' as string,
  };

  statusOptions = ['planning', 'active', 'completed'];

  constructor(
    private sprintService: SprintService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.sprintId = this.route.snapshot.params['id'];
    if (this.sprintId) {
      this.isEdit.set(true);
      this.loading.set(true);
      this.sprintService.getById(this.sprintId).subscribe({
        next: ({ sprint }) => {
          this.form = {
            name: sprint.name,
            startDate: new Date(sprint.startDate).toISOString().split('T')[0],
            endDate: new Date(sprint.endDate).toISOString().split('T')[0],
            status: sprint.status,
          };
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      });
    } else {
      this.prefillDates();
    }
  }

  private prefillDates(): void {
    const now = new Date();
    const day = now.getDate();
    const month = now.getMonth();
    const year = now.getFullYear();

    // Auto-generate sprint name and dates based on 2 sprints/month
    if (day <= 15) {
      this.form.name = `${now.toLocaleString('default', { month: 'long' })} Sprint 1`;
      this.form.startDate = new Date(year, month, 1).toISOString().split('T')[0];
      this.form.endDate = new Date(year, month, 15).toISOString().split('T')[0];
    } else {
      this.form.name = `${now.toLocaleString('default', { month: 'long' })} Sprint 2`;
      this.form.startDate = new Date(year, month, 16).toISOString().split('T')[0];
      // Last day of the month
      this.form.endDate = new Date(year, month + 1, 0).toISOString().split('T')[0];
    }
  }

  onSubmit(): void {
    if (!this.form.name.trim() || !this.form.startDate || !this.form.endDate) return;
    this.saving.set(true);

    const payload: any = { ...this.form };

    const request = this.isEdit()
      ? this.sprintService.update(this.sprintId, payload)
      : this.sprintService.create(payload);

    request.subscribe({
      next: (sprint) => {
        this.router.navigate(['/sprints', sprint._id]);
      },
      error: () => this.saving.set(false),
    });
  }
}
