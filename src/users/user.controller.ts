// users/users.controller.ts
import {
  Controller,
  Patch,Get,
  Body,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  Req
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import { UserService } from './user.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Request } from 'express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UserService) {}

  @Patch('profile')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('profilePic', {
      limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB cap
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/^image\/(jpeg|png|webp)$/)) {
          return cb(new Error('Only jpg/png/webp allowed'), false);
        }
        cb(null, true);
      },
    }),
  )
  async updateProfile(
    @Req() req,
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.usersService.updateProfile(req.user.id, dto, file);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findUsers(@Req() req) {
    return this.usersService.findUsers(req.user.id);
  }
}
