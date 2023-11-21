import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/prisma.service';
import { AuthController } from './auth.controller';
import { UsersService } from 'src/users/users.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      global: true,
      secret: 'newsecrethidden',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [AuthService, UsersService, PrismaService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
