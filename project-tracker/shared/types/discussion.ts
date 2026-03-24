export interface IDiscussion {
  _id: string;
  project: string;
  title: string;
  content: string;
  createdBy: string;
  linkedTask?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IComment {
  _id: string;
  discussion: string;
  user: string;
  content: string;
  createdAt: Date;
}
