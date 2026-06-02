// thoughts/entities/thought-share.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../../users/user.entity';
import { Thoughts } from './thoughts.entity';

@Entity()
export class ThoughtShare {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user!: User;

  @ManyToOne(() => Thoughts, (thought) => thought.shares, {
    onDelete: 'CASCADE',
  })
  thought!: Thoughts;

  @CreateDateColumn()
  createdAt!: Date;
}
