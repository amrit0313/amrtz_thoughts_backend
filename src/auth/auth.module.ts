import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/users/user.module';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { GoogleStrategy } from './google.strategy';
import { AuthController } from './auth.controller';
import { FacebookStrategy } from './facebook.strategy';

@Module({
  imports: [
    ConfigModule,
    UserModule, // 🔥 needed so you can use UserService
    JwtModule.register({
      secret: 'secretKey',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [AuthService, JwtStrategy, GoogleStrategy, ], //FacebookStrategy
  controllers: [AuthController],
})
export class AuthModule {}
