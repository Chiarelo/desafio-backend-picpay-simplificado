import { Body, Controller, Get, Post, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserSessionDto } from './dto/userAuthDto';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async Login(@Body() { email, password }: UserSessionDto) {
    return this.authService.Login(email, password);
  }

  // Rota de verificação (apenas para testes caso necessário)
  @Get('check')
  async CheckRoute(@Headers('authorization') auth: string) {
    const token = auth?.replace('Bearer ', '');

    return this.authService.checkroute(token);
  }
}
