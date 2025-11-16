import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/database/prisma.module';
import { AuthModule } from 'src/session/auth.module';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';

@Module({
  // Talvez seja necessário o User
  imports: [AuthModule, PrismaModule],
  controllers: [TransactionsController],
  providers: [TransactionsService],
})
export class TransactionsModule {}
