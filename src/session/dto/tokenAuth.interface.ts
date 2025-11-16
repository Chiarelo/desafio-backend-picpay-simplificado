import type { UserType } from '@prisma/client';

export interface JwtPayload {
  email: string;
  document: string;
  type: UserType;
  sub: string;
}
