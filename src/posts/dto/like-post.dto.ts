import { Post, User } from '@prisma/client';
import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class CreateLikeDto {
  @IsNumber()
  userId?: number;

  @IsNumber()
  postId?: number;

  user?: User;

  post?: Post;

  @IsString()
  content?: string;

  @IsBoolean()
  isSuperlike: boolean;
}
