import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { ChatGateway } from './chat.gateway';
import { MessagingService } from './messaging.service';
import { MessagesController } from './messaging.controller';
import { Message } from './messaging.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
      }),
    }),
  ],
  providers: [ChatGateway, MessagingService],
  controllers: [MessagesController],
})
export class MessagingModule {}
