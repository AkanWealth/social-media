import {
  Controller,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Get,
} from '@nestjs/common';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post(':postId/like')
  async likePost(
    @Param('postId') postId: number,
    @Body('userId') userId: number,
    @Body('isSuperlike') isSuperlike: boolean,
  ): Promise<any> {
    await this.postsService.likePost(userId, postId, isSuperlike);
    return { message: 'Post liked successfully' };
  }

  @Post(':postId/comment')
  async createComment(
    @Param('postId', ParseIntPipe) postId: number,
    @Body('userId', ParseIntPipe) userId: number,
    @Body('content') content: string,
  ): Promise<any> {
    const comment = await this.postsService.createComment(
      userId,
      postId,
      content,
    );
    console.log('controller-comment: ', comment);
    return comment;
  }

  @Post('create')
  async createPost(
    @Body('userId') userId: number,
    @Body('content') content: string,
  ): Promise<any> {
    const post = await this.postsService.createPost(userId, content);
    return { message: 'Post created successfully', post };
  }

  @Get('/')
  async getPostsWithCommentsAndLikes(): Promise<any> {
    try {
      const postsWithCommentsAndLikes =
        await this.postsService.getPostsWithCommentsAndLikes();
      return { success: true, data: postsWithCommentsAndLikes };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @Get('/:userId')
  async getPostsForUser(@Param('userId') userId: number): Promise<any> {
    try {
      const userPosts = await this.postsService.getPostsForUser(userId);
      return { success: true, data: userPosts };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}
