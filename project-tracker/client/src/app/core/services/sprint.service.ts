import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Sprint } from '../models/sprint.model';
import { Task } from '../models/task.model';
import { Observable } from 'rxjs';

export interface SprintDetail {
  sprint: Sprint;
  tasks: Task[];
}

@Injectable({ providedIn: 'root' })
export class SprintService {
  constructor(private api: ApiService) {}

  getAll(status?: string): Observable<Sprint[]> {
    const params: Record<string, string> = {};
    if (status) params['status'] = status;
    return this.api.get<Sprint[]>('/sprints', params);
  }

  getCurrent(): Observable<SprintDetail> {
    return this.api.get<SprintDetail>('/sprints/current');
  }

  getById(id: string): Observable<SprintDetail> {
    return this.api.get<SprintDetail>(`/sprints/${id}`);
  }

  create(sprint: Partial<Sprint>): Observable<Sprint> {
    return this.api.post<Sprint>('/sprints', sprint);
  }

  update(id: string, sprint: Partial<Sprint>): Observable<Sprint> {
    return this.api.put<Sprint>(`/sprints/${id}`, sprint);
  }

  delete(id: string): Observable<any> {
    return this.api.delete(`/sprints/${id}`);
  }
}
