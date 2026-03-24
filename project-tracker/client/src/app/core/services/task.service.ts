import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Task } from '../models/task.model';
import { Observable } from 'rxjs';

export interface TaskFilters {
  status?: string;
  priority?: string;
  category?: string;
  assignedTo?: string;
  sprint?: string;
  project?: string;
  tag?: string;
}

@Injectable({ providedIn: 'root' })
export class TaskService {
  constructor(private api: ApiService) {}

  getAll(filters?: TaskFilters): Observable<Task[]> {
    const params: Record<string, string> = {};
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params[key] = value;
      });
    }
    return this.api.get<Task[]>('/tasks', params);
  }

  getById(id: string): Observable<Task> {
    return this.api.get<Task>(`/tasks/${id}`);
  }

  getByProject(projectId: string, status?: string): Observable<Task[]> {
    const params: Record<string, string> = {};
    if (status) params['status'] = status;
    return this.api.get<Task[]>(`/tasks/project/${projectId}`, params);
  }

  create(task: Partial<Task>): Observable<Task> {
    return this.api.post<Task>('/tasks', task);
  }

  update(id: string, task: Partial<Task>): Observable<Task> {
    return this.api.put<Task>(`/tasks/${id}`, task);
  }

  updateStatus(id: string, status: string): Observable<Task> {
    return this.api.put<Task>(`/tasks/${id}/status`, { status });
  }

  delete(id: string): Observable<any> {
    return this.api.delete(`/tasks/${id}`);
  }
}
