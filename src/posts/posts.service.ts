import { PrismaService } from 'src/prisma.service';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateCommentDto } from './dto/comment-post.dto';
import { CreatePostDto } from './dto/create-post.dto';
import { CreateLikeDto } from './dto/like-post.dto';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async likePost(
    userId: number,
    postId: number,
    isSuperlike: boolean,
  ): Promise<CreateLikeDto> {
    const existingLike = await this.prisma.like.findFirst({
      where: { userId: Number(userId), postId: Number(postId) },
    });

    if (existingLike) {
      throw new NotFoundException(`User already liked the post`);
    }

    const like = await this.prisma.like.create({
      data: {
        userId,
        postId: Number(postId),
        isSuperlike,
      },
    });

    return like;
  }

  async createComment(
    userId: number,
    postId: number,
    content: string,
  ): Promise<CreateCommentDto> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException(`Post not found`);
    }

    if (!user.verified) {
      throw new UnauthorizedException(`User must be verified to comment`);
    }

    const userComment = await this.prisma.comment.create({
      data: {
        userId,
        postId,
        content,
        verified: true,
      },
    });

    return userComment;
  }

  async createPost(userId: number, content: string): Promise<CreatePostDto> {
    const post = await this.prisma.post.create({
      data: {
        userId,
        content,
        expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000),
      },
    });
    return post;
  }

  async updatePostExpirationStatus(): Promise<any> {
    const postsToExpire = await this.prisma.post.findMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });

    for (const post of postsToExpire) {
      return await this.prisma.post.update({
        where: { id: post.id },
        data: { isExpired: true },
      });
    }
  }

  async getPostsWithCommentsAndLikes(): Promise<any> {
    const posts = await this.prisma.post.findMany({
      include: {
        comments: true,
        likes: true,
      },
    });

    return posts;
  }

  async getPostsForUser(userId: number): Promise<any> {
    const numericUserId = Number(userId);

    if (isNaN(numericUserId)) {
      throw new BadRequestException('Invalid userId');
    }

    const userPosts = await this.prisma.post.findMany({
      where: { userId: numericUserId },
      include: {
        comments: true,
        likes: true,
      },
    });

    if (userPosts.length === 0) {
      return { message: 'No posts for this user' };
    }

    return userPosts;
  }
}
