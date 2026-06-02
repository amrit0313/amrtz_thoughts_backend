import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Thoughts } from './entities/thoughts.entity';
import { ThoughtLike } from './entities/thought_likes.entitiy';
import { ThoughtShare } from './entities/thought_share.entity';
import { ThoughtService } from './thoughts.service';
import { ThoughtsController } from './thoughts.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Thoughts, ThoughtLike, ThoughtShare])],
  providers: [ThoughtService],
  controllers: [ThoughtsController],
})
export class ThoughtsModule {}
