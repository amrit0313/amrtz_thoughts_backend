import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';
import { MessagingService } from './messaging.service';
import { JwtService } from '@nestjs/jwt';
import { subscribe } from 'diagnostics_channel';

@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  @WebSocketServer()
  server!: Server;

  private connectedUsers = new Map<number, string>();

  constructor(
    private messagingservice: MessagingService,
    private jwtService: JwtService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token;
      const payload = this.jwtService.verify(token);
      client.data.user = payload;
      this.connectedUsers.set(payload.sub, client.id);
      console.log(`User ${payload.sub} connected — socket ${client.id}`);
    } catch {
      client.disconnect();
    }
  }

  async handleDisconnect(client: Socket) {
    const userId = client?.data?.user?.sub;
    if (userId) {
      this.connectedUsers.delete(userId);
      console.log(`User ${userId} disconnected`);
    }
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { receiverId: number; content: string },
  ) {
    const sender = client.data.user;

    const message = await this.messagingservice.saveMessages(
      sender,
      payload.receiverId,
      payload.content,
    );

    const receiverSocketId = this.connectedUsers.get(payload.receiverId);

    if (receiverSocketId) {
      // push message to receiver
      this.server.to(receiverSocketId).emit('newMessage', message);

      //mark delivered thing
      this.messagingservice.markDelivered(message.id);
      client.emit('message delivered', { messageId: message.id });
    }
    client.emit('message sent', message);
  }

  @SubscribeMessage('markseen')
  async markSeen(
    @ConnectedSocket() Client: Socket,
    @MessageBody() payload: { senderId: number },
  ) {
    const currentUser = Client.data.user;

    await this.messagingservice.markSeenAll(payload.senderId, currentUser.sub);

    const senderSocketId = this.connectedUsers.get(payload.senderId);
    if (senderSocketId) {
      this.server.to(senderSocketId).emit('messagesSeen', {
        by: currentUser.sub,
      });
    }
  }
}
