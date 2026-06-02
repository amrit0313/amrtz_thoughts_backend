// posts/entities/post-like.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  Unique,
} from 'typeorm';
import { User } from '../../users/user.entity';
import { Thoughts } from './thoughts.entity';

@Entity()
@Unique(['user', 'thought']) // one like per user per post
export class ThoughtLike {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user!: User;

  @ManyToOne(() => Thoughts, (thought) => thought.likes, {
    onDelete: 'CASCADE',
  })
  thought!: Thoughts;

  @CreateDateColumn()
  createdAt!: Date;
}
