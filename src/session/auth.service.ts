import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { UserService } from 'src/user/user.service';
import { compare } from 'bcrypt';
import type { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';

@Injectable({})
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  // eslint-disable-next-line @typescript-eslint/require-await
  async createToken(user: User) {
    return this.jwtService.sign(
      {
        email: user.email,
        type: user.type,
      },
      {
        subject: String(user.id),
      },
    );
  }

  async Login(email: string, password: string) {
    const user = await this.userService.getUserByEmailOrDocument(email, '');

    if (user === null || !user) {
      throw new BadRequestException('Invalid credentials');
    }

    console.log(user);

    const isPasswordValid = await compare(password, user.password);

    console.log(isPasswordValid, 'chegou aqui');

    // Ok parou aqui
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid credentials');
    }

    return this.createToken(user);
  }
}
