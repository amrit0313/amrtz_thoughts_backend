import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { User } from 'src/users/user.entity';
import { ThoughtLike } from './thought_likes.entitiy';
import { ThoughtShare } from './thought_share.entity';

@Entity()
export class Thoughts {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  thought!: string;

  @ManyToOne(() => User, (user) => user.thoughts)
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @OneToMany(() => ThoughtLike, (thoughtLike) => thoughtLike.thought)
  likes!: ThoughtLike[];

  @OneToMany(() => ThoughtShare, (thoughtShare) => thoughtShare.thought)
  shares!: ThoughtShare[];

  @Column({ default: 0 })
  likeCount!: number; // cached counter — avoids COUNT(*) on every fetch

  @Column({ default: 0 })
  shareCount!: number;
}
