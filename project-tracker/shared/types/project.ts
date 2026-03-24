export interface IProject {
  _id: string;
  name: string;
  description?: string;
  owner: string;
  status: 'active' | 'on-hold' | 'completed' | 'archived';
  startDate?: Date;
  repoLink?: string;
  prodUrl?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}
