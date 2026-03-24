export interface IUser {
  _id: string;
  name: string;
  email: string;
  googleId: string;
  avatar?: string;
  role: 'developer' | 'manager' | 'ceo';
  createdAt: Date;
}
