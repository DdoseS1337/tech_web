import { Injectable } from '@nestjs/common';
import * as cloudinary from 'cloudinary';

type AvailableFormatInfo = {
  jpg: any;
  jpeg: any;
  png: any;
  webp: any;
};

const imageUrls: string[] = [];

@Injectable()
export class ImageService {
  async processImage(
    inputPath: string,
    width: number,
    height: number,
    format: keyof AvailableFormatInfo,
  ): Promise<string> {
    try {
      const uploadedImage = await cloudinary.v2.uploader.upload(inputPath, {
        width,
        height,
        format,
        folder: 'processed',
        overwrite: true,
      });

      console.log('Image uploaded to Cloudinary:', uploadedImage);
      const imageUrl = uploadedImage.secure_url;
      imageUrls.push(imageUrl);
      return imageUrl;
    } catch (error) {
      console.error('Error processing image:', error);
      throw new Error('Failed to process image');
    }
  }

  async getImagesFromCloudinary() {
    try {
      return imageUrls;
    } catch (error) {
      console.error('Error retrieving images from Cloudinary:', error);
      return [];
    }
  }
}
