import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginUserDto } from 'src/users/dto/login-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async createUser(userData: CreateUserDto): Promise<CreateUserDto> {
    try {
      const existingUsers = await this.prisma.user.findMany({
        where: {
          OR: [{ username: userData.username }, { email: userData.email }],
        },
        select: {
          id: true,
          username: true,
          email: true,
          password: true,
          accounts: {
            select: {
              id: true,
              password: true,
            },
          },
        },
      });

      const existingUser = existingUsers.find((user) =>
        user.accounts.some((account) =>
          bcrypt.compareSync(userData.password, account.password),
        ),
      );

      if (existingUser) {
        throw new NotFoundException(`User already exists`);
      }

      const hashedPassword = await bcrypt.hash(userData.password, 10);

      const newUser = await this.prisma.user.create({
        data: {
          username: userData.username,
          email: userData.email,
          password: hashedPassword,
          accounts: {
            create: {
              password: hashedPassword,
            },
          },
        },
        select: {
          id: true,
          username: true,
          email: true,
          password: true,
        },
      });

      const payload = { ...newUser };

      return {
        ...newUser,
        access_token: await this.jwtService.signAsync(payload),
      };
    } catch (error) {
      console.error('Error in createUser:', error);
      throw error;
    }
  }

  async createSecondAccount(userId: number, password: string): Promise<any> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: Number(userId) },
        include: {
          accounts: true,
        },
      });

      if (!user) {
        throw new NotFoundException(`User not found`);
      }

      if (user.accounts.length >= 2) {
        throw new BadRequestException(`User already has two accounts`);
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const account = await this.prisma.account.create({
        data: {
          userId: user.id,
          password: hashedPassword,
        },
      });

      return account;
    } catch (error) {
      console.error('Error in createSecondAccount:', error);
      throw error;
    }
  }

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { username },
      include: {
        accounts: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValidPassword = user.accounts.some((account) =>
      bcrypt.compareSync(password, account.password),
    );

    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return { user, access_token: await this.jwtService.signAsync(user) };
  }

  async login(userData: Partial<LoginUserDto>) {
    const user = await this.userService.findByUsername(userData.username);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const account = await this.userService.findAccountByUserId(user.id);

    if (!account) {
      throw new UnauthorizedException('User account not found');
    }

    const isPasswordValid = await bcrypt.compare(
      userData.password,
      account.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    const { password, ...payloadData } = user;
    const usedPassword = account.password;

    const payload = {
      ...payloadData,
      accountId: account.id,
      sub: user.id,
      usedPassword,
      password,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async validateUserById(id: number): Promise<any> {
    return this.userService.findById(id);
  }
}
