import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from 'src/users/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Friendships } from './friendships.entity';
import { FriendshipStatus } from './enums/status.enums';

@Injectable()
export class FriendshipService {
  constructor(
    @InjectRepository(Friendships)
    private repo: Repository<Friendships>,
  ) {}

  async sendRequest(sender: User, receiver: User) {
    if (sender.id == receiver.id) {
      throw new Error('You cant send friend Request to yourself');
    }
    const existing = await this.repo.findOne({
      where: [
        { sender: { id: sender.id }, receiver: { id: receiver.id } },
        { sender: { id: receiver.id }, receiver: { id: sender.id } },
      ],
    });
    if (existing) {
      throw new Error('friend request already pending');
    }
    const friendships = this.repo.create({
        sender,
        receiver,
        status:FriendshipStatus.PENDING
    });
    return this.repo.save(friendships)

  }
}
