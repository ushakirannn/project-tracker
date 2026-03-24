export type RoadmapStatus = 'planned' | 'in_progress' | 'completed' | 'delayed';
export type RoadmapPriority = 'low' | 'medium' | 'high' | 'critical';

export interface RoadmapItem {
  _id: string;
  project: any;
  title: string;
  description?: string;
  status: RoadmapStatus;
  isStatusOverridden: boolean;
  priority: RoadmapPriority;
  startDate?: string;
  targetDate?: string;
  createdBy: any;
  createdAt: string;
  updatedAt: string;
  // Derived fields from API
  linkedTasks?: any[];
  taskCount?: number;
  completedTaskCount?: number;
  relatedSprints?: any[];
}
