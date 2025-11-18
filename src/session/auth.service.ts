/* eslint-disable @typescript-eslint/require-await */
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { User } from '@prisma/client';
import { compare } from 'bcrypt';
import { PrismaService } from '../database/prisma.service'; 
import { UserService } from '../user/user.service';
import type { JwtPayload } from './dto/tokenAuth.interface';

@Injectable({})
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async createToken(user: User) {
    const payload: JwtPayload = {
      sub: String(user.id),
      email: user.email,
      document: user.cpfCnpj,
      type: user.type,
    };

    return { accessToken: this.jwtService.sign(payload) };
  }

  async checkToken(token: string) {
    try {
      const data = await this.jwtService.verifyAsync<JwtPayload>(token);

      return data;
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token expirado');
      }

      if (error.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('Token inválido');
      }

      throw new BadRequestException('Erro ao validar token');
    }
  }

  isValidToken(token: string) {
    try {
      this.checkToken(token);
      return true;
    } catch (error) {
      return false;
    }
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

  async checkroute(token: string) {
    return this.checkToken(token);
  }
}
