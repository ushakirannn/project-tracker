export interface ProjectMetric {
  _id: string;
  project: string;
  metricName: string;
  metricUnit: string;
  createdAt: Date;
  latestSnapshot?: MetricSnapshot | null;
  latestRelease?: string;
  latestSource?: string | null;
}

export interface MetricSnapshot {
  _id: string;
  release?: any;
  metric: ProjectMetric | string;
  previousValue: number;
  currentValue: number;
  percentageChange: number;
  note?: string;
  createdAt: Date;
}
