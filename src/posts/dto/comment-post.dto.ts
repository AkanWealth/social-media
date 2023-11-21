import { Post, User } from '@prisma/client';
import { IsNumber, IsString } from 'class-validator';

export class CreateCommentDto {
  @IsNumber()
  userId?: number;

  @IsNumber()
  postId?: number;

  user?: User;

  post?: Post;

  @IsString()
  content?: string;
}
