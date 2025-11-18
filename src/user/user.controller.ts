import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './dto/userCreate.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('register')
  async createUser(@Body() userData: UserDto) {
    return this.userService.createUser(userData);
  }

  @Get()
  async getUserByEmailOrDocument(
    @Query('email') email: string,
    @Query('document') document: string,
  ) {
    return this.userService.getUserByEmailOrDocument(email, document);
  }

  @Get(':id')
  async getUserByID(@Param('id') id: string) {
    return this.userService.getUserByID(id);
  }
}
