//user.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';
import { Thoughts } from 'src/thoughts/thoughts.entity';
import { Genre } from './enums/user.enums';
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  email!: string;

  @Column({
    type:'enum',
    enum:Genre,
    default:Genre.COMEDY
  })
  genre!:Genre

  @Column({ nullable: true })
  @Exclude()
  passwordHash!: string;

  @Column({ nullable: true })
  name?: string;

  @OneToMany(()=>Thoughts, thoughts=>thoughts.user)
  thoughts!:Thoughts[]
}
