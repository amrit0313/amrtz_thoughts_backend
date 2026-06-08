import { User } from 'src/users/user.entity';
import {
  Entity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'sender_id' })
  sender!: User;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'receiver_id' })
  receiver!: User;

  @Column()
  content!: string;

  @Column({ default: false })
  delivered!: boolean;

  @Column({ default: false })
  seen!: boolean;

  @CreateDateColumn()
  createdAt!: Date;
}
