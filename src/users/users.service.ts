import { Injectable, NotFoundException } from '@nestjs/common';
import { Account, User } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findByUsername(username: string) {
    return this.prisma.user.findUnique({
      where: {
        username: username,
      },
    });
  }

  async findById(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: Number(id) },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async findAccountByUserId(userId: number): Promise<Account | undefined> {
    const userID = await this.prisma.account.findUnique({
      where: { id: Number(userId) },
    });

    return userID;
  }

  async verifyUser(userId: number): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id: Number(userId) },
    });

    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    return await this.prisma.user.update({
      where: { id: userId },
      data: { verified: true },
    });
  }
}
