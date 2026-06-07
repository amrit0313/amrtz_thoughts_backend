// users/users.controller.ts
import {
  BadRequestException,
  Controller,
  Patch,
  Get,
  Body,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  Req,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import { UserService } from './user.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Request } from 'express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UserService) {}

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findUser(@Req() req, @Param('id', ParseIntPipe) id: number) {
    return this.usersService.findById(req.id, id);
  }

  @Patch('profile')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('profilePic', {
      limits: { fileSize: 10 * 1024 * 1024 }, // 5 MB cap
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/^image\/(jpeg|png|webp)$/)) {
          return cb(
            new BadRequestException('Only jpg/png/webp allowed'),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  async updateProfile(
    @Req() req,
    @UploadedFile() profilePic: Express.Multer.File,
    @Body() dto: UpdateProfileDto,
  ) {
    console.log('it came here');
    return this.usersService.updateProfile(req.user.id, dto, profilePic);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findUsers(@Req() req) {
    return this.usersService.findUsers(req.user.id);
  }
}
