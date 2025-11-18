import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../database/prisma.service';
import type { User } from '@prisma/client';
import { UserTransaction } from './dto/UserTransactionDto';
import { UserService } from '../user/user.service'; 

@Injectable()
export class TransactionsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async transfer(user: User, { payee, payer, value }: UserTransaction) {
    if (payer !== user.id) {
      throw new UnauthorizedException(
        'Usuário não autorizado a enviar com este ID',
      );
    }

    if (user.type === 'MERCHANT') {
      throw new UnauthorizedException(
        'Lojistas só recebem transferências, não enviam dinheiro para ninguém',
      );
    }

    if (Number(user.balance) < value) {
      throw new BadRequestException('O usuário não possui saldo suficiente');
    }

    if (value <= 0) {
      throw new BadRequestException('Valor inválido para transferência');
    }

    const payeeUser = await this.userService.getUserByID(String(payee));

    if (!payeeUser) {
      throw new BadRequestException('Recebedor não encontrado');
    }

    await this.processTransfer();

    await this.prismaService.$transaction(async (tx) => {
      // 1. Debitar o payer
      await tx.user.update({
        where: { id: String(payer) },
        data: {
          balance: {
            decrement: value, // isso evita problemas com Decimal
          },
        },
      });

      // 2. Creditar o payee
      await tx.user.update({
        where: { id: String(payee) },
        data: {
          balance: {
            increment: value,
          },
        },
      });

      // 3. Registrar transferência
      await tx.transaction.create({
        data: {
          payerId: String(payer),
          payeeId: String(payee),
          value,
        },
      });
    });
  }

  async processTransfer() {
    const EXTERNAL_AUTHORIZATION = 'https://util.devi.tools/api/v2/authorize';
    const response = await fetch(EXTERNAL_AUTHORIZATION);

    const result = await response.json();

    if (result.status !== 'success') {
      throw new UnauthorizedException(
        'Transferência não autorizada pelo serviço externo',
      );
    }
  }
}
