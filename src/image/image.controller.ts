import {
  Controller,
  Get,
  Post,
  Render,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageService } from './image.service';
import * as cloudinary from 'cloudinary';
import { ConfigService } from '@nestjs/config';

@Controller('images')
export class ImageController {
  constructor(
    private readonly imageService: ImageService,
    private readonly configService: ConfigService,
  ) {
    cloudinary.v2.config({
      cloudinary_url: this.configService.get('CLOUDINARY_URL'),
    });
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('image'))
  async uploadFile(@UploadedFile() file) {
    try {
      const user = await cloudinary.v2.uploader
        .upload_stream({ resource_type: 'auto' }, async (error, result) => {
          if (result) {
            await this.imageService.processImage(result.url, 300, 200, 'png');
          } else {
            console.error('Error uploading file to Cloudinary:', error);
            throw new Error('Failed to upload and process image');
          }
        })
        .end(file.buffer);
      return { message: 'File uploaded and processed' };
    } catch (error) {
      console.error('Error uploading file to Cloudinary:', error);
      throw new Error('Failed to upload and process image');
    }
  }
  @Get('all')
  @Render('gallery')
  async galleryPage() {
    const images = await this.imageService.getImagesFromCloudinary();
    return { images };
  }
  @Get()
  @Render('upload-photo')
  uploadpotoPage() {
    const images = this.imageService.getImagesFromCloudinary();
    return { images };
  }

  @Get('all')
  async getAllImages() {
    return this.imageService.getImagesFromCloudinary();
  }
}
