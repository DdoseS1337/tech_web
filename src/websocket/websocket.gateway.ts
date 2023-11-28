import { ConfigService } from '@nestjs/config';
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import * as jwt from 'jsonwebtoken';
import { UsersService } from '../users/users.service';
import { TokenPayload } from '../auth/interfaces/token-payload.interface';
@WebSocketGateway()
export class MyWebSocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {}
  connectedUsers: { [clientId: string]: string } = {};

  @WebSocketServer() server: Server;

  handleConnection(client: Socket) {
    this.handleSocketConnection(client);
  }

  handleDisconnect(client: Socket) {
    const userId = this.connectedUsers[client.id];
    if (userId) {
      const email = this.getEmailFromUserId(userId);
      this.notifyUserStatusChanged(email, 'offline');
      delete this.connectedUsers[client.id];
      this.sendOnlineUsersList();
    }
  }

  private async handleSocketConnection(client: Socket) {
    const email = await this.extractEmailFromWebSocket(client);
    if (email) {
      this.connectedUsers[client.id] = email;
      this.notifyUserStatusChanged(email, 'online');
      this.sendOnlineUsersList();
    } else {
      console.error('Invalid token or no email found');
      client.disconnect(true);
    }
  }

  private async extractEmailFromWebSocket(
    client: Socket,
  ): Promise<string | undefined> {
    const cookieString = client.handshake?.headers?.cookie;
    if (cookieString) {
      const tokenFromWebSocket = cookieString.split('=')[1];
      const secretKey = this.configService.get('JWT_SECRET');

      return new Promise((resolve) => {
        jwt.verify(tokenFromWebSocket, secretKey, async (err, decoded) => {
          if (err) {
            console.error('Error decoding JWT token:', err);
            resolve(undefined);
          } else {
            console.log('Decoded JWT token:', decoded);
            const user = await this.getUser(decoded);
            resolve(user?.email);
          }
        });
      });
    } else {
      console.error('No cookie found in handshake');
      return undefined;
    }
  }

  async getUser({ userId }: TokenPayload) {
    return this.usersService.getUser({ id: userId });
  }

  private getEmailFromUserId(userId: string): string | undefined {
    const clientIds = Object.keys(this.connectedUsers);
    for (const clientId of clientIds) {
      if (this.connectedUsers[clientId] === userId) {
        return userId;
      }
    }
    return undefined;
  }

  notifyUserStatusChanged(email: string, status: string) {
    const userClients = Object.keys(this.connectedUsers).filter(
      (clientId) => this.connectedUsers[clientId] !== email,
    );
    userClients.forEach((clientId) => {
      console.log("clientId " + clientId);
      this.server.to(clientId).emit('userStatusChanged', { email, status });
    });
  }

  sendOnlineUsersList() {
    const onlineUsers = Object.values(this.connectedUsers).filter(
      (email, index, arr) => arr.indexOf(email) === index
    );
    this.server.emit('onlineUsersList', onlineUsers);
  }
}
