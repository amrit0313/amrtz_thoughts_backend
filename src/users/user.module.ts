import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserService } from './user.service';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { UsersController } from './user.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User]), CloudinaryModule],
  providers: [UserService],
  controllers: [UsersController],
  exports: [UserService], // Export the service if other modules need it
})
export class UserModule {}
