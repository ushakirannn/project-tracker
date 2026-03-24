import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Discussion, Comment } from '../models/discussion.model';
import { Task } from '../models/task.model';
import { Observable } from 'rxjs';

export interface DiscussionDetail {
  discussion: Discussion;
  comments: Comment[];
}

@Injectable({ providedIn: 'root' })
export class DiscussionService {
  constructor(private api: ApiService) {}

  getAll(project?: string): Observable<Discussion[]> {
    const params: Record<string, string> = {};
    if (project) params['project'] = project;
    return this.api.get<Discussion[]>('/discussions', params);
  }

  getById(id: string): Observable<DiscussionDetail> {
    return this.api.get<DiscussionDetail>(`/discussions/${id}`);
  }

  getByProject(projectId: string): Observable<Discussion[]> {
    return this.api.get<Discussion[]>(`/discussions/project/${projectId}`);
  }

  create(discussion: Partial<Discussion>): Observable<Discussion> {
    return this.api.post<Discussion>('/discussions', discussion);
  }

  update(id: string, discussion: Partial<Discussion>): Observable<Discussion> {
    return this.api.put<Discussion>(`/discussions/${id}`, discussion);
  }

  delete(id: string): Observable<any> {
    return this.api.delete(`/discussions/${id}`);
  }

  addComment(id: string, content: string): Observable<Comment> {
    return this.api.post<Comment>(`/discussions/${id}/comments`, { content });
  }

  createTask(id: string, taskData: any): Observable<Task> {
    return this.api.post<Task>(`/discussions/${id}/create-task`, taskData);
  }
}
