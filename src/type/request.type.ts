import { Request } from 'express';

export interface AuthRequest extends Request {
  user: AuthRequest;
  userId: number;
  role?: number;
}
