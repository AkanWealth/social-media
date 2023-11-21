import { AuthService } from './auth.service';
import { Body, Controller, Param, Post } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async registerStudent(
    @Body()
    createUser: CreateUserDto,
  ) {
    return this.authService.createUser(createUser);
  }

  @Post(':userId/accounts')
  async createSecondAccount(
    @Param('userId') userId: number,
    @Body('password') password: string,
  ): Promise<void> {
    return this.authService.createSecondAccount(userId, password);
  }

  @Post('login')
  async login(
    @Body('username') username: string,
    @Body('password') password: string,
  ): Promise<any> {
    const user = await this.authService.validateUser(username, password);
    return user;
  }
}
