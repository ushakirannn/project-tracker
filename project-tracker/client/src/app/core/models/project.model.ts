export interface Project {
  _id: string;
  name: string;
  description?: string;
  owner: any;
  status: 'active' | 'on-hold' | 'completed' | 'archived';
  currentFocus?: string;
  startDate?: Date;
  repoLink?: string;
  prodUrl?: string;
  createdBy: any;
  createdAt: Date;
  updatedAt: Date;
}
