export interface Release {
  _id: string;
  project: any;
  sprint?: any;
  version: string;
  releaseDate: Date;
  description?: string;
  changes: string[];
  createdBy: any;
  createdAt: Date;
}
