import {
  Controller,
  Param,
  ParseIntPipe,
  UseGuards,
  Req,
  Delete,
} from '@nestjs/common';
import { Get, Post, Patch } from '@nestjs/common';
import { FriendshipService } from './friendships.service';
import { Friendships } from './friendships.entity';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';

@Controller('friendship')
export class FriendshipController {
  constructor(private readonly FriendshipService: FriendshipService) {}

  @Get('')
  @UseGuards(JwtAuthGuard)
  async getRequests(
    @Req() req,
  ){
    return this.FriendshipService.getRequests(req.user)
  }

  @Post('request/:id')
  @UseGuards(JwtAuthGuard)
  async requestFriendship(@Req() req, @Param('id', ParseIntPipe) id) {
    return this.FriendshipService.sendRequest(req.user.id, id);
  }

  @Post('accept/:id')
  @UseGuards(JwtAuthGuard)
  async acceptFriendship(@Req() req, @Param('id', ParseIntPipe) id) {
    return this.FriendshipService.acceptRequest(req.user.id, id);
  }

  @Delete('request/:id')
  @UseGuards(JwtAuthGuard)
  async cancelRequest(@Req() req, @Param('id', ParseIntPipe) id) {
    return this.FriendshipService.cancelRequest(req.user.id, id);
  }
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async unfriend(@Req() req, @Param('id', ParseIntPipe) id) {
    return this.FriendshipService.unfriend(req.user.id, id)
  }
}
