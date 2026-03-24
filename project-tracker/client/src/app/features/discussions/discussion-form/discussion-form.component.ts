import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DiscussionService } from '../../../core/services/discussion.service';
import { ProjectService } from '../../../core/services/project.service';
import { Project } from '../../../core/models/project.model';

@Component({
  selector: 'app-discussion-form',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './discussion-form.component.html',
  styleUrl: './discussion-form.component.css',
})
export class DiscussionFormComponent implements OnInit {
  isEdit = signal(false);
  loading = signal(false);
  discussionId = '';
  saving = signal(false);
  projects = signal<Project[]>([]);

  form = { project: '', title: '', content: '' };

  constructor(
    private discussionService: DiscussionService,
    private projectService: ProjectService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.projectService.getAll().subscribe(p => this.projects.set(p));

    const projectId = this.route.snapshot.queryParams['project'];
    if (projectId) this.form.project = projectId;

    this.discussionId = this.route.snapshot.params['id'];
    if (this.discussionId) {
      this.isEdit.set(true);
      this.loading.set(true);
      this.discussionService.getById(this.discussionId).subscribe({
        next: ({ discussion }) => {
          this.form = {
            project: discussion.project?._id || '',
            title: discussion.title,
            content: discussion.content,
          };
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      });
    }
  }

  onSubmit(): void {
    if (!this.form.project || !this.form.title.trim() || !this.form.content.trim()) return;
    this.saving.set(true);

    const request = this.isEdit()
      ? this.discussionService.update(this.discussionId, this.form)
      : this.discussionService.create(this.form);

    request.subscribe({
      next: (d: any) => this.router.navigate(['/discussions', d._id]),
      error: () => this.saving.set(false),
    });
  }
}
