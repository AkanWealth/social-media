import { User } from '@prisma/client';
import { IsNumber, IsString } from 'class-validator';

export class CreatePostDto {
  @IsNumber()
  userId: number;

  user?: User;

  @IsString()
  content: string;

  expiresAt: Date;
}
