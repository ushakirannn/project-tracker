export type TaskStatus = 'planned' | 'in-progress' | 'blocked' | 'testing' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';
export type TaskCategory = 'feature' | 'bug' | 'improvement' | 'research' | 'maintenance';

export interface IDeadlineExtension {
  newDeadline: Date;
  reason: string;
}

export interface IAttachment {
  filename: string;
  url: string;
  uploadedAt: Date;
}

export interface ITask {
  _id: string;
  title: string;
  description?: string;
  project: string;
  sprint?: string;
  assignedTo?: string;
  status: TaskStatus;
  priority: TaskPriority;
  category?: TaskCategory;
  startDate?: Date;
  deadline?: Date;
  deadlineExtension?: IDeadlineExtension;
  attachments?: IAttachment[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}
