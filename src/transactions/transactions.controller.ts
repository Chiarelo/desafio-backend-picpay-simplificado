import { Controller, Post, UseGuards, Body } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { User } from 'src/decorators/user.decorator';
import type { UserTransaction } from './dto/UserTransactionDto';

console.log(AuthGuard);

@Controller('transactions')
@UseGuards(AuthGuard)
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  async Transfer(@User() user, @Body() body: UserTransaction) {
    return this.transactionsService.transfer(user, body);
  }
}
