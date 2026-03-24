export interface IRelease {
  _id: string;
  project: string;
  version: string;
  releaseDate: Date;
  description?: string;
  changes: string[];
  createdBy: string;
  createdAt: Date;
}
