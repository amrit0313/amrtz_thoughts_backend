import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Thoughts } from './entities/thoughts.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/user.entity';
import { ThoughtLike } from './entities/thought_likes.entitiy';
import { ThoughtShare } from './entities/thought_share.entity';
import { NotFoundError } from 'rxjs';

@Injectable()
export class ThoughtService {
  constructor(
    @InjectRepository(Thoughts)
    private repo: Repository<Thoughts>,
    @InjectRepository(ThoughtLike)
    private likeRepo: Repository<ThoughtLike>,
    @InjectRepository(ThoughtShare)
    private shareRepo: Repository<ThoughtShare>,
  ) {}

  private thoughtQuery() {
    return this.repo
      .createQueryBuilder('thought')
      .leftJoinAndSelect('thought.user', 'user')
      .loadRelationCountAndMap('thought.likeCount', 'thought.likes');
  }

  // async getThoughts() {
  //   return await this.thoughtQuery()
  //     .orderBy('thought.id', 'DESC')
  //     .getMany();
  // }

  // async findThoughtById(id: number) {
  //   return await this.thoughtQuery()
  //     .where('thought.id = :id', { id })
  //     .getOne();
  // }

  async createThought(user: User, thought: string) {
    const user_thought = this.repo.create({ thought, user });
    return await this.repo.save(user_thought);
  }

  async getThoughts(page = 1, limit = 20) {
    return this.repo.find({
      relations: { user: true },
      order: { id: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async findThoughtById(id: number) {
    return await this.repo.findOne({
      where: { id },
      relations: { user: true },
    });
  }

  //   async like(user: User, thought: Thoughts) {
  //     const thoughts = this.repo.findOne({ where: { id: thought.id } });
  //     if (!thought) throw new NotFoundException("Didn't find  thought");
  //     const like = await this.likeRepo.findOne({
  //       where: {
  //         user: { id: user.id },
  //         thought: { id: thought.id },
  //       },
  //       lock: { mode: 'pessimistic_write' },
  //     });
  //     if (like) {
  //       await this.likeRepo.delete(like.id);
  //       await this.repo.decrement({ id: thought.id }, 'likeCount', 1);
  //     } else {
  //       const newLike = this.likeRepo.create({
  //         user,
  //         thought,
  //       });
  //       await this.likeRepo.save(newLike);
  //       await this.repo.increment({ id: thought.id }, 'likeCount', 1);
  //     }
  //   }

  async like(user: User, thought: Thoughts) {
    const thoughts = this.repo.findOne({ where: { id: thought.id } });
    if (!thought) throw new NotFoundException("Didn't find  thought");
    const existing = await this.likeRepo.findOne({
      where: { user: { id: user.id }, thought: { id: thought.id } },
    });

    if (existing) {
      const deleted = await this.likeRepo.delete({ id: existing.id });
      if (deleted.affected) {
        await this.repo.decrement({ id: thought.id }, 'likeCount', 1);
      }
    } else {
      try {
        await this.likeRepo.save(this.likeRepo.create({ user, thought }));
        await this.repo.increment({ id: thought.id }, 'likeCount', 1);
      } catch (e) {
        // unique constraint blocked duplicate insert, do nothing
      }
    }
  }
}
