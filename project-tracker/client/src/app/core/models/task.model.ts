export type TaskStatus = 'planned' | 'in-progress' | 'blocked' | 'testing' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';
export type TaskCategory = 'feature' | 'bug' | 'improvement' | 'research' | 'maintenance';

export interface Task {
  _id: string;
  title: string;
  description?: string;
  project: any;
  sprint?: any;
  assignedTo?: any;
  status: TaskStatus;
  priority: TaskPriority;
  category?: TaskCategory;
  startDate?: Date;
  deadline?: Date;
  roadmapItem?: any;
  tags?: string[];
  deadlineExtension?: { newDeadline: Date; reason: string };
  attachments?: { filename: string; url: string; uploadedAt: Date }[];
  createdBy: any;
  createdAt: Date;
  updatedAt: Date;
}
