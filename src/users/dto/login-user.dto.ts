import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class LoginUserDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  password: string;

  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  access_token?: string;
}
