import { Request } from 'express';
import type { JwtPayload } from './tokenAuth.interface';

export interface AuthRequest extends Request {
  user: JwtPayload;
}
