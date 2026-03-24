import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { DiscussionService } from '../../../core/services/discussion.service';
import { Discussion, Comment } from '../../../core/models/discussion.model';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-discussion-detail',
  standalone: true,
  imports: [RouterLink, FormsModule, DatePipe, LoadingSpinnerComponent],
  templateUrl: './discussion-detail.component.html',
  styleUrl: './discussion-detail.component.css',
})
export class DiscussionDetailComponent implements OnInit {
  discussion = signal<Discussion | null>(null);
  comments = signal<Comment[]>([]);
  loading = signal(true);
  showDeleteConfirm = signal(false);
  showCreateTask = signal(false);
  newComment = '';
  addingComment = signal(false);
  taskTitle = '';
  creatingTask = signal(false);

  constructor(
    private discussionService: DiscussionService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    this.discussionService.getById(id).subscribe({
      next: ({ discussion, comments }) => {
        this.discussion.set(discussion);
        this.comments.set(comments);
        this.taskTitle = discussion.title;
        this.loading.set(false);
      },
      error: () => { this.loading.set(false); this.router.navigate(['/discussions']); },
    });
  }

  submitComment(): void {
    const d = this.discussion();
    if (!d || !this.newComment.trim()) return;
    this.addingComment.set(true);

    this.discussionService.addComment(d._id, this.newComment).subscribe({
      next: (comment) => {
        this.comments.update(c => [...c, comment]);
        this.newComment = '';
        this.addingComment.set(false);
      },
      error: () => this.addingComment.set(false),
    });
  }

  createTaskFromDiscussion(): void {
    const d = this.discussion();
    if (!d || !this.taskTitle.trim()) return;
    this.creatingTask.set(true);

    this.discussionService.createTask(d._id, { title: this.taskTitle }).subscribe({
      next: (task) => this.router.navigate(['/tasks', task._id]),
      error: () => this.creatingTask.set(false),
    });
  }

  confirmDelete(): void { this.showDeleteConfirm.set(true); }
  cancelDelete(): void { this.showDeleteConfirm.set(false); }

  deleteDiscussion(): void {
    const d = this.discussion();
    if (!d) return;
    this.discussionService.delete(d._id).subscribe({
      next: () => this.router.navigate(['/discussions']),
    });
  }
}
