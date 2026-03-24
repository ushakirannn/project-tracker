import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Release } from '../models/release.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ReleaseService {
  constructor(private api: ApiService) {}

  getAll(project?: string): Observable<Release[]> {
    const params: Record<string, string> = {};
    if (project) params['project'] = project;
    return this.api.get<Release[]>('/releases', params);
  }

  getById(id: string): Observable<Release> {
    return this.api.get<Release>(`/releases/${id}`);
  }

  getByProject(projectId: string): Observable<Release[]> {
    return this.api.get<Release[]>(`/releases/project/${projectId}`);
  }

  create(release: Partial<Release>): Observable<Release> {
    return this.api.post<Release>('/releases', release);
  }

  update(id: string, release: Partial<Release>): Observable<Release> {
    return this.api.put<Release>(`/releases/${id}`, release);
  }

  delete(id: string): Observable<any> {
    return this.api.delete(`/releases/${id}`);
  }
}
