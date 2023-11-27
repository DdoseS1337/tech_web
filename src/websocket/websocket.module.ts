import { Module } from '@nestjs/common';
import { MyWebSocketGateway } from './websocket.gateway';
import { UsersModule } from 'src/users/users.module';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

@Module({
  imports: [
    UsersModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        JWT_SECRET: Joi.string().required(),
      }),
    }),
  ],
  providers: [MyWebSocketGateway],
  exports: [MyWebSocketGateway],
})
export class WebsocketModule {}
