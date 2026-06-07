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
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async getRequests(currentUser: User) {
    return await this.repo.find({
      where: [
        { sender: { id: currentUser.id } },
        { receiver: { id: currentUser.id } },
      ],
    });
  }

  async sendRequest(sender: number, receiver: number) {
    if (sender == receiver) {
      throw new Error('You cant send friend Request to yourself');
    }
    const existing = await this.repo.findOne({
      where: [
        { sender: { id: sender }, receiver: { id: receiver } },
        { sender: { id: receiver }, receiver: { id: sender } },
      ],
    });
    if (existing) {
      if (existing.status === FriendshipStatus.PENDING) {
        throw new Error('Request already pending');
      }

      if (existing.status === FriendshipStatus.ACCEPTED) {
        throw new Error('Already friends');
      }
    }

    const friendships = this.repo.create({
      sender: { id: sender },
      receiver: { id: receiver },
      status: FriendshipStatus.PENDING,
    });

    await this.repo.save(friendships);

    return {
      success: true,
      friendshipStatus: 'pending',
      action: 'sent',
    };
  }

  async cancelRequest(currentUser: number, receiver: number) {
    const friendship = await this.repo.findOne({
      where: { sender: { id: currentUser }, receiver: { id: receiver } },
    });
    if (!friendship) throw new Error('No request was sent to cancel');
    if (friendship.sender.id !== currentUser) {
      throw new Error('Only sender can cancel request');
    }

    if (friendship.status !== FriendshipStatus.PENDING) {
      throw new Error('Only pending requests can be cancelled');
    }
    await this.repo.remove(friendship);
    return {
      success: true,
      friendshipStatus: 'none',
      action: 'cancelled',
    };
  }

  async acceptRequest(currentUser: number, sender: number) {
    const friendship = await this.repo.findOne({
      where: {
        receiver: { id: currentUser },
        sender: { id: sender },
        status: FriendshipStatus.PENDING,
      },
    });
    if (!friendship) throw new Error('Friendship doesnt exist');

    friendship.status = FriendshipStatus.ACCEPTED;
    await this.repo.save(friendship);
    return {
      success: true,
      friendshipStatus: 'accepted',
      action: 'accepted',
    };
  }

  async unfriend(currentUserId: number, id: number) {
    const existing = await this.repo.findOne({
      where: [
        { sender: { id: currentUserId }, receiver: { id } },
        { sender: { id }, receiver: { id: currentUserId } },
      ],
    });
    if (existing?.status !== FriendshipStatus.ACCEPTED) {
      throw new Error('You arent friends');
    }
    await this.repo.remove(existing);
    return {
      success: true,
      friendshipStatus: 'none',
      action: 'unfriended',
    };
  }
}
