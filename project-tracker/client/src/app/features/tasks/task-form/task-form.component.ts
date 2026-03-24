import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../../core/services/task.service';
import { ProjectService } from '../../../core/services/project.service';
import { ApiService } from '../../../core/services/api.service';
import { Project } from '../../../core/models/project.model';
import { User } from '../../../core/models/user.model';
import { Sprint } from '../../../core/models/sprint.model';
import { RoadmapItem } from '../../../core/models/roadmap.model';
import { RoadmapService } from '../../../core/services/roadmap.service';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.css',
})
export class TaskFormComponent implements OnInit {
  isEdit = signal(false);
  loading = signal(false);
  taskId = '';
  saving = signal(false);
  projects = signal<Project[]>([]);
  users = signal<User[]>([]);
  sprints = signal<Sprint[]>([]);
  roadmapItems = signal<RoadmapItem[]>([]);

  form = {
    title: '',
    description: '',
    project: '',
    sprint: '',
    assignedTo: '',
    status: 'planned' as string,
    priority: 'medium' as string,
    category: '' as string,
    startDate: '',
    deadline: '',
    roadmapItem: '',
  };

  tags: string[] = [];
  tagInput = '';

  statusOptions = ['planned', 'in-progress', 'blocked', 'testing', 'completed'];
  priorityOptions = ['low', 'medium', 'high', 'critical'];
  categoryOptions = ['feature', 'bug', 'improvement', 'research', 'maintenance'];

  constructor(
    private taskService: TaskService,
    private projectService: ProjectService,
    private roadmapService: RoadmapService,
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.projectService.getAll().subscribe(p => this.projects.set(p));
    this.apiService.get<User[]>('/auth/users').subscribe(u => this.users.set(u));
    this.apiService.get<Sprint[]>('/sprints').subscribe({
      next: (s) => this.sprints.set(s),
      error: () => {},
    });

    // Pre-fill from query params
    const projectId = this.route.snapshot.queryParams['project'];
    if (projectId) {
      this.form.project = projectId;
      this.loadRoadmapItems(projectId);
    }
    const roadmapItemId = this.route.snapshot.queryParams['roadmapItem'];
    if (roadmapItemId) this.form.roadmapItem = roadmapItemId;
    const sprintId = this.route.snapshot.queryParams['sprint'];
    if (sprintId) this.form.sprint = sprintId;

    this.taskId = this.route.snapshot.params['id'];
    if (this.taskId) {
      this.isEdit.set(true);
      this.loading.set(true);
      this.taskService.getById(this.taskId).subscribe({
        next: (task) => {
          this.form = {
            title: task.title,
            description: task.description || '',
            project: task.project?._id || '',
            sprint: task.sprint?._id || '',
            assignedTo: task.assignedTo?._id || '',
            status: task.status,
            priority: task.priority,
            category: task.category || '',
            startDate: task.startDate
              ? new Date(task.startDate).toISOString().split('T')[0]
              : '',
            deadline: task.deadline
              ? new Date(task.deadline).toISOString().split('T')[0]
              : '',
            roadmapItem: task.roadmapItem?._id || '',
          };
          this.tags = task.tags || [];
          this.loading.set(false);
          if (task.project?._id) this.loadRoadmapItems(task.project._id);
        },
        error: () => this.loading.set(false),
      });
    }
  }

  loadRoadmapItems(projectId: string): void {
    if (!projectId) {
      this.roadmapItems.set([]);
      return;
    }
    this.roadmapService.getByProject(projectId).subscribe({
      next: (items) => this.roadmapItems.set(items),
      error: () => this.roadmapItems.set([]),
    });
  }

  onProjectChange(): void {
    this.loadRoadmapItems(this.form.project);
    this.form.roadmapItem = '';
  }

  addTag(): void {
    const tag = this.tagInput.trim().toLowerCase();
    if (tag && !this.tags.includes(tag)) {
      this.tags.push(tag);
    }
    this.tagInput = '';
  }

  onTagKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault();
      this.addTag();
    }
  }

  removeTag(tag: string): void {
    this.tags = this.tags.filter(t => t !== tag);
  }

  onSubmit(): void {
    if (!this.form.title.trim()) return;
    this.saving.set(true);

    const payload: any = { ...this.form, tags: this.tags };
    // Clean empty values
    Object.keys(payload).forEach(key => {
      if (payload[key] === '') delete payload[key];
    });

    const request = this.isEdit()
      ? this.taskService.update(this.taskId, payload)
      : this.taskService.create(payload);

    request.subscribe({
      next: (task) => {
        this.router.navigate(['/tasks', task._id]);
      },
      error: () => this.saving.set(false),
    });
  }
}
