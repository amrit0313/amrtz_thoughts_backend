import { Injectable } from '@nestjs/common';
import { Message } from './messaging.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/user.entity';

@Injectable()
export class MessagingService {
  constructor(
    @InjectRepository(Message)
    private repo: Repository<Message>,
  ) {}

  async saveMessages(sender: any, receiver: number, content: string) {
    const message = this.repo.create({
      sender: { id: sender.sub },
      receiver: { id: receiver },
      content,
      delivered: false,
      seen: false,
    });
    return await this.repo.save(message);
  }

  async getConversation(userId: number, friendId: number) {
    return this.repo.find({
      where: [
        { sender: { id: userId }, receiver: { id: friendId } },
        { sender: { id: friendId }, receiver: { id: userId } },
      ],
      order: { createdAt: 'ASC' },
    });
  }

  async markDelivered(messageId: number) {
    await this.repo.update(messageId, { delivered: true });
  }

  async markSeenAll(senderId: number, receiverId: number) {
    await this.repo
      .createQueryBuilder()
      .update(Message)
      .set({ seen: true })
      .where(
        'sender_id = :senderId AND receiver_id = :receiverId AND seen = false',
        {
          senderId,
          receiverId,
        },
      )
      .execute();
  }
}
