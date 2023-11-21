import { Account, Like, Post, Comment } from '@prisma/client';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  id?: number;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  password?: string;

  @IsNotEmpty()
  @IsString()
  username?: string;

  @IsNotEmpty()
  @IsEmail()
  email?: string;

  @IsOptional()
  accounts?: Account;

  @IsOptional()
  likes?: Like;

  @IsOptional()
  comments?: Comment;

  @IsOptional()
  posts?: Post;

  access_token?: string;
}
