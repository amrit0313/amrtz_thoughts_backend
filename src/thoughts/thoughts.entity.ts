import { Entity, PrimaryGeneratedColumn, Column, ForeignKey, ManyToOne, JoinColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { User } from 'src/users/user.entity';

@Entity()
export class Thoughts {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  thought: string;

  @ManyToOne(()=>User, user=>user.thoughts)
  @JoinColumn({name : 'user_id'})
  user:User
}
