import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UserSessionDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
