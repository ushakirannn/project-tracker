export interface ISprint {
  _id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  status: 'planning' | 'active' | 'completed';
  createdAt: Date;
}
