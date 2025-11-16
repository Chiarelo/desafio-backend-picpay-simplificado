import { IsNumber, IsPositive, IsUUID } from 'class-validator';

export class UserTransaction {
  @IsUUID()
  payer: string; // ✅ Mudou de number para string

  @IsUUID()
  payee: string; // ✅ Mudou de number para string

  @IsNumber()
  @IsPositive()
  value: number;
}
