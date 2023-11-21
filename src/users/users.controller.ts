import {
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { UsersService } from './users.service';
import { User } from '@prisma/client';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.userService.findById(id);
  }

  @UseGuards(AuthGuard)
  @Post(':userId/verify')
  async verifyUser(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<User> {
    const verifiedUser = await this.userService.verifyUser(userId);
    return verifiedUser;
  }
}
