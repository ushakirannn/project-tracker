import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { RoadmapItem } from '../models/roadmap.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RoadmapService {
  constructor(private api: ApiService) {}

  getByProject(projectId: string): Observable<RoadmapItem[]> {
    return this.api.get<RoadmapItem[]>(`/roadmap/project/${projectId}`);
  }

  getById(id: string): Observable<RoadmapItem> {
    return this.api.get<RoadmapItem>(`/roadmap/${id}`);
  }

  getUpcoming(): Observable<RoadmapItem[]> {
    return this.api.get<RoadmapItem[]>('/roadmap/upcoming');
  }

  create(item: Partial<RoadmapItem>): Observable<RoadmapItem> {
    return this.api.post<RoadmapItem>('/roadmap', item);
  }

  update(id: string, item: Partial<RoadmapItem>): Observable<RoadmapItem> {
    return this.api.put<RoadmapItem>(`/roadmap/${id}`, item);
  }

  overrideStatus(id: string, status: string): Observable<RoadmapItem> {
    return this.api.put<RoadmapItem>(`/roadmap/${id}/override-status`, { status });
  }

  clearOverride(id: string): Observable<RoadmapItem> {
    return this.api.put<RoadmapItem>(`/roadmap/${id}/clear-override`, {});
  }

  delete(id: string): Observable<any> {
    return this.api.delete(`/roadmap/${id}`);
  }
}
