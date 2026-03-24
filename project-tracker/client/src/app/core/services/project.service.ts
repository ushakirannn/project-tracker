import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Project } from '../models/project.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProjectService {
  constructor(private api: ApiService) {}

  getAll(status?: string): Observable<Project[]> {
    const params: Record<string, string> = {};
    if (status) params['status'] = status;
    return this.api.get<Project[]>('/projects', params);
  }

  getById(id: string): Observable<Project> {
    return this.api.get<Project>(`/projects/${id}`);
  }

  create(project: Partial<Project>): Observable<Project> {
    return this.api.post<Project>('/projects', project);
  }

  update(id: string, project: Partial<Project>): Observable<Project> {
    return this.api.put<Project>(`/projects/${id}`, project);
  }

  delete(id: string): Observable<any> {
    return this.api.delete(`/projects/${id}`);
  }
}
