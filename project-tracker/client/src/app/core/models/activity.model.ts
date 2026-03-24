export interface Activity {
  _id: string;
  user: any;
  action: string;
  entityType: 'project' | 'task' | 'sprint' | 'release' | 'discussion' | 'comment';
  entityId: string;
  entityName: string;
  metadata?: Record<string, any>;
  timestamp: Date;
}
