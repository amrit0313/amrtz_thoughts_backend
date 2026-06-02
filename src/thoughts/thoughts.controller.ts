import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import { ThoughtService } from './thoughts.service';

@Controller('thoughts')
export class ThoughtsController {
  constructor(private readonly thoughtService: ThoughtService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getThoughts() {
    return this.thoughtService.getThoughts();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getThoughtById(@Param('id', ParseIntPipe) id: number) {
    const thought = await this.thoughtService.findThoughtById(id);

    if (!thought) {
      return { message: 'Thought not found' };
    }

    return thought;
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async createThought(
    @Req() req: Request & { user?: any },
    @Body() body: { thought: string },
  ) {
    return this.thoughtService.createThought(req.user, body.thought);
  }

  @Post(':id/like')
  @UseGuards(JwtAuthGuard)
  async toggleLike(
    @Req() req: Request & { user?: any },
    @Param('id', ParseIntPipe) id: number,
  ) {
    const thought = await this.thoughtService.findThoughtById(id);

    if (!thought) {
      return { message: 'Thought not found' };
    }

    await this.thoughtService.like(req.user, thought);
    return { message: 'Thought like updated' };
  }
}
