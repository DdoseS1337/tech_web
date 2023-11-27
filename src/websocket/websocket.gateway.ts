import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
@WebSocketGateway()
export class MyWebSocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  handleConnection(client: Socket) {
    console.log('Client connected:', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected:', client.id);
  }

  notifyUserLoggedIn(email: string) {
    const message = `User ${email} logged in`;
    this.server.emit('userLoggedIn', {
      message,
    });
  }

  notifyUserLoggedOut(email: string) {
    const message = `User ${email} logged out`;
    this.server.emit('userLoggedOut', {
      message,
    });
  }
}
