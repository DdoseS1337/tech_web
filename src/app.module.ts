import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { ImageModule } from './image/image.module';
import { UsersModule } from './users/users.module';
import { WebsocketModule } from './websocket/websocket.module';
import { LoggerModule } from './logger/logger.module';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { AppController } from './app.contoller';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    ImageModule,
    UsersModule,
    WebsocketModule,
    LoggerModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        PORT: Joi.number().required(),
        DATABASE_PORT: Joi.number().required(),
        DATABASE_HOST: Joi.string().required(),
        DATABASE_PASSWORD: Joi.string().required(),
        DATABASE_USER: Joi.string().required(),
        DATABASE_NAME: Joi.string().required(),
      }),
    }),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
