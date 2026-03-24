export type EntityType = 'project' | 'task' | 'sprint' | 'release' | 'discussion' | 'comment';

export interface IActivity {
  _id: string;
  user: string;
  action: string;
  entityType: EntityType;
  entityId: string;
  entityName: string;
  metadata?: Record<string, any>;
  timestamp: Date;
}
