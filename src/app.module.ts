import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'newsecrethidden',
      signOptions: { expiresIn: '1d' },
    }),
    AuthModule,
    UsersModule,
    PostsModule,
  ],
  controllers: [],
})
export class AppModule {}
