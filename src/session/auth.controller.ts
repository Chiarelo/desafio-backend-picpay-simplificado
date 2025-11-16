import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserSessionDto } from './dto/userAuthDto';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async Login(@Body() { email, password }: UserSessionDto) {
    return this.authService.Login(email, password);
  }
}
