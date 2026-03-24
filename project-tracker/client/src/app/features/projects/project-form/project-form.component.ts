import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProjectService } from '../../../core/services/project.service';
import { AuthService } from '../../../core/services/auth.service';
import { ApiService } from '../../../core/services/api.service';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-project-form',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './project-form.component.html',
  styleUrl: './project-form.component.css',
})
export class ProjectFormComponent implements OnInit {
  isEdit = signal(false);
  loading = signal(false);
  projectId = '';
  saving = signal(false);
  users = signal<User[]>([]);

  form = {
    name: '',
    description: '',
    owner: '',
    status: 'active' as string,
    currentFocus: '',
    startDate: '',
    repoLink: '',
    prodUrl: '',
  };

  statusOptions = ['active', 'on-hold', 'completed', 'archived'];

  constructor(
    private projectService: ProjectService,
    private authService: AuthService,
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadUsers();

    this.projectId = this.route.snapshot.params['id'];
    if (this.projectId) {
      this.isEdit.set(true);
      this.loading.set(true);
      this.projectService.getById(this.projectId).subscribe({
        next: (project) => {
          this.form = {
            name: project.name,
            description: project.description || '',
            owner: project.owner?._id || '',
            status: project.status,
            startDate: project.startDate
              ? new Date(project.startDate).toISOString().split('T')[0]
              : '',
            currentFocus: project.currentFocus || '',
            repoLink: project.repoLink || '',
            prodUrl: project.prodUrl || '',
          };
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      });
    } else {
      this.form.owner = this.authService.user()?._id || '';
    }
  }

  loadUsers(): void {
    this.apiService.get<User[]>('/auth/users').subscribe({
      next: (users) => this.users.set(users),
    });
  }

  onSubmit(): void {
    if (!this.form.name.trim()) return;
    this.saving.set(true);

    const payload: any = { ...this.form };
    if (!payload.startDate) delete payload.startDate;
    if (!payload.repoLink) delete payload.repoLink;
    if (!payload.prodUrl) delete payload.prodUrl;

    const request = this.isEdit()
      ? this.projectService.update(this.projectId, payload)
      : this.projectService.create(payload);

    request.subscribe({
      next: (project) => {
        this.router.navigate(['/projects', project._id]);
      },
      error: () => this.saving.set(false),
    });
  }
}
