import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from 'nestjs-pino';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  app.useLogger(app.get(Logger));
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.setBaseViewsDir(join(__dirname, '..', 'src', 'views')); 
  app.setViewEngine('hbs');
  await app.listen(configService.get('PORT'), '0.0.0.0');
}
bootstrap();
