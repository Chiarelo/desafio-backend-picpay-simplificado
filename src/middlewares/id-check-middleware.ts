// src/common/middleware/uuid-validation.middleware.ts
import {
  Injectable,
  NestMiddleware,
  BadRequestException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { validate as isUUID } from 'uuid';

@Injectable()
export class UuidValidationMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;

    // Se existe 'id' na rota, valida como UUID
    if (id && !isUUID(id)) {
      throw new BadRequestException(`Invalid UUID format: ${id}`);
    }

    next();
  }
}
