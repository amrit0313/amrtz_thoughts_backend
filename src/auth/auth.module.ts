import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
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
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
    }),
  ],
  providers: [AuthService, JwtStrategy, GoogleStrategy, ], //FacebookStrategy
  controllers: [AuthController],
})
export class AuthModule {}
