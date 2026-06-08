// messages/messages.controller.ts
import { Controller, Get, Param, ParseIntPipe, Req, UseGuards } from '@nestjs/common';
import { MessagingService } from './messaging.service';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagingService) {}

  @Get(':friendId')
  @UseGuards(JwtAuthGuard)
  async getConversation(
    @Req() req,
    @Param('friendId', ParseIntPipe) friendId: number,
  ) {
    return this.messagesService.getConversation(req.user.id, friendId);
  }
}