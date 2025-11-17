import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import type { UserDto } from './dto/userCreate.dto';
import  { User } from '@prisma/client';
import { hash } from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser({
    document,
    email,
    name,
    password,
  }: UserDto): Promise<User> {
    const existingUser = await this.getUserByEmailOrDocument(email, document);

    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        fullName: name,
        cpfCnpj: document,
        email,
        password: hashedPassword,
        type: 'COMMON',
      },
    });

    return user;
  }

  async getUserByID(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async getUserByEmailOrDocument(
    email: string,
    document: string,
  ): Promise<User | null> {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ email }, { cpfCnpj: document }],
      },
    });

    return user;
  }
}
