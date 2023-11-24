import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { ImageModule } from './image/image.module';
import { UsersModule } from './users/users.module';
import { WebsocketModule } from './websocket/websocket.module';

@Module({
  imports: [DatabaseModule, AuthModule, ImageModule, UsersModule, WebsocketModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
