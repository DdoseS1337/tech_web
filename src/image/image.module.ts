import { Module } from '@nestjs/common';
import { ImageService } from './image.service';
import { ImageController } from './image.controller';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        CLOUDINARY_URL: Joi.string().required(),
      }),
    }),
  ],
  providers: [ImageService],
  controllers: [ImageController],
})
export class ImageModule {}
