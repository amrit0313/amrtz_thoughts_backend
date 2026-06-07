import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserService } from './user.service';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { UsersController } from './user.controller';
import { Friendships } from 'src/friendships/friendships.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Friendships]), CloudinaryModule],
  providers: [UserService],
  controllers: [UsersController],
  exports: [UserService], // Export the service if other modules need it
})
export class UserModule {}
