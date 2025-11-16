import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/database/prisma.module';
import { AuthModule } from 'src/session/auth.module';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { AuthService } from 'src/session/auth.service';
import { AuthGuard } from 'src/guards/auth.guard';

@Module({
  // Talvez seja necessário o User
  imports: [AuthModule, PrismaModule, JwtModule, UserModule],
  controllers: [TransactionsController],
  providers: [TransactionsService, AuthGuard],
})
export class TransactionsModule {}
