import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaModule } from '../database/prisma.module';

@Module({
  providers: [UserService, PrismaModule],
  controllers: [UserController],
  imports: [PrismaModule],
  exports: [UserService],
})
export class UserModule {}
