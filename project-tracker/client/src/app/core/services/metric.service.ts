import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { ProjectMetric, MetricSnapshot } from '../models/metric.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MetricService {
  constructor(private api: ApiService) {}

  getByProject(projectId: string): Observable<ProjectMetric[]> {
    return this.api.get<ProjectMetric[]>(`/metrics/project/${projectId}`);
  }

  getLatestByProject(projectId: string): Observable<ProjectMetric[]> {
    return this.api.get<ProjectMetric[]>(`/metrics/project/${projectId}/latest`);
  }

  create(projectId: string, data: { metricName: string; metricUnit: string }): Observable<ProjectMetric> {
    return this.api.post<ProjectMetric>(`/metrics/project/${projectId}`, data);
  }

  update(id: string, data: { metricName: string; metricUnit: string }): Observable<ProjectMetric> {
    return this.api.put<ProjectMetric>(`/metrics/${id}`, data);
  }

  delete(id: string): Observable<any> {
    return this.api.delete(`/metrics/${id}`);
  }

  getSnapshotsByRelease(releaseId: string): Observable<MetricSnapshot[]> {
    return this.api.get<MetricSnapshot[]>(`/metrics/release/${releaseId}`);
  }

  saveSnapshots(releaseId: string, snapshots: { metricId: string; previousValue: number; currentValue: number }[]): Observable<MetricSnapshot[]> {
    return this.api.put<MetricSnapshot[]>(`/metrics/release/${releaseId}`, { snapshots });
  }

  createSnapshot(data: { metricId: string; previousValue: number; currentValue: number; note?: string }): Observable<MetricSnapshot> {
    return this.api.post<MetricSnapshot>('/metrics/snapshots', data);
  }

  getSnapshotHistory(metricId: string): Observable<MetricSnapshot[]> {
    return this.api.get<MetricSnapshot[]>(`/metrics/metric/${metricId}/history`);
  }
}
