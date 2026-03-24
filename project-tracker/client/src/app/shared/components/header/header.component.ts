import { Component, Input, OnInit, OnDestroy, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { TaskService } from '../../../core/services/task.service';
import { Project } from '../../../core/models/project.model';
import { User } from '../../../core/models/user.model';
import { Sprint } from '../../../core/models/sprint.model';
import { RoadmapItem } from '../../../core/models/roadmap.model';
import { RoadmapService } from '../../../core/services/roadmap.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Input() pageTitle = '';
  private keyHandler = this.onKeyDown.bind(this);

  showQuickTask = signal(false);
  saving = signal(false);
  projects = signal<Project[]>([]);
  users = signal<User[]>([]);
  sprints = signal<Sprint[]>([]);
  roadmapItems = signal<RoadmapItem[]>([]);
  dataLoaded = false;

  quickForm = {
    title: '',
    project: '',
    assignedTo: '',
    priority: 'medium',
    sprint: '',
    deadline: '',
    roadmapItem: '',
  };

  constructor(
    private router: Router,
    private api: ApiService,
    private taskService: TaskService,
    private roadmapService: RoadmapService,
  ) {}

  ngOnInit(): void {
    document.addEventListener('keydown', this.keyHandler);
  }

  ngOnDestroy(): void {
    document.removeEventListener('keydown', this.keyHandler);
  }

  private onKeyDown(e: KeyboardEvent): void {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      this.goToSearch();
    }
    if (e.key === 'Escape' && this.showQuickTask()) {
      this.closeQuickTask();
    }
  }

  goToSearch(): void {
    this.router.navigate(['/search']);
  }

  openQuickTask(): void {
    if (!this.dataLoaded) {
      this.api.get<Project[]>('/projects').subscribe(p => this.projects.set(p));
      this.api.get<User[]>('/auth/users').subscribe(u => this.users.set(u));
      this.api.get<Sprint[]>('/sprints').subscribe(s => this.sprints.set(s));
      this.dataLoaded = true;
    }
    this.showQuickTask.set(true);
  }

  closeQuickTask(): void {
    this.showQuickTask.set(false);
    this.quickForm = { title: '', project: '', assignedTo: '', priority: 'medium', sprint: '', deadline: '', roadmapItem: '' };
    this.roadmapItems.set([]);
  }

  onQuickProjectChange(): void {
    this.quickForm.roadmapItem = '';
    if (this.quickForm.project) {
      this.roadmapService.getByProject(this.quickForm.project).subscribe({
        next: (items) => this.roadmapItems.set(items),
        error: () => this.roadmapItems.set([]),
      });
    } else {
      this.roadmapItems.set([]);
    }
  }

  submitQuickTask(): void {
    if (!this.quickForm.title.trim()) return;
    this.saving.set(true);

    const payload: any = { title: this.quickForm.title, priority: this.quickForm.priority };
    if (this.quickForm.project) payload.project = this.quickForm.project;
    if (this.quickForm.assignedTo) payload.assignedTo = this.quickForm.assignedTo;
    if (this.quickForm.sprint) payload.sprint = this.quickForm.sprint;
    if (this.quickForm.roadmapItem) payload.roadmapItem = this.quickForm.roadmapItem;
    if (this.quickForm.deadline) payload.deadline = this.quickForm.deadline;

    this.taskService.create(payload).subscribe({
      next: (task) => {
        this.saving.set(false);
        this.closeQuickTask();
        this.router.navigate(['/tasks', task._id]);
      },
      error: () => this.saving.set(false),
    });
  }
}
