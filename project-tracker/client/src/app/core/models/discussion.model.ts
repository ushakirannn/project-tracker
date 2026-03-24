export interface Discussion {
  _id: string;
  project: any;
  title: string;
  content: string;
  createdBy: any;
  linkedTask?: any;
  createdAt: Date;
  updatedAt: Date;
}

export interface Comment {
  _id: string;
  discussion: string;
  user: any;
  content: string;
  createdAt: Date;
}
