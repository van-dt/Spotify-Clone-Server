import {
  DeleteObjectCommand,
  DeleteObjectCommandInput,
  PutObjectCommand,
  PutObjectCommandInput,
  CreateMultipartUploadCommand,
  UploadPartCommand,
  CompleteMultipartUploadCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Md5 } from 'ts-md5';

import { EConfiguration } from '@core/config';
import { ErrorMessage } from '@core/enum';

import { VUploadBody } from './dto';
import { VCompleteUploadBody } from './dto/complete-multi-upload.dto';
import { VPreSignedUrlsBody } from './dto/getSignedUrl.dto';
// const sharp = require('sharp');

@Injectable()
export class UploadService {
  constructor(private configService: ConfigService) {}

  getClient(): S3Client {
    const client = new S3Client({
      region: this.configService.get(EConfiguration.AWS_REGION),
      credentials: {
        accessKeyId: this.configService.get(EConfiguration.AWS_ACCESS_KEY_ID),
        secretAccessKey: this.configService.get(
          EConfiguration.AWS_SECRET_ACCESS_KEY,
        ),
      },
    });

    return client;
  }

  async initMultipartUpload(unGenerateName: string) {
    const s3Client = this.getClient();
    const bucketName = this.configService.get(EConfiguration.AWS_S3_BUCKET);

    const md5FileName = Md5.hashStr(unGenerateName);
    const fileName =
      unGenerateName === '1'
        ? `${unGenerateName}@@${md5FileName}.${this.getFileExtension(
            unGenerateName,
          )}`
        : `${Date.now().toString()}-${md5FileName}`;

    try {
      const multipartUpload = await s3Client.send(
        new CreateMultipartUploadCommand({
          Bucket: bucketName,
          Key: fileName,
          ACL: 'public-read',
        }),
      );

      return {
        fileId: multipartUpload.UploadId,
        fileKey: multipartUpload.Key,
      };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('Error: ', error);
    }
  }

  async createS3SignedUrl(body: VPreSignedUrlsBody) {
    const s3Client = this.getClient();
    const bucketName = this.configService.get(EConfiguration.AWS_S3_BUCKET);

    const params = {
      Bucket: bucketName,
      Key: body.fileKey,
      PartNumber: body.partNumber,
      UploadId: body.fileId,
      ACL: 'public-read',
    };

    return await getSignedUrl(s3Client, new UploadPartCommand(params));
  }

  async completeMultiUpload(body: VCompleteUploadBody) {
    const s3Client = this.getClient();
    const bucketName = this.configService.get(EConfiguration.AWS_S3_BUCKET);

    const multipartParams = {
      Bucket: bucketName,
      Key: body.fileKey,
      UploadId: body.fileId,
      MultipartUpload: {
        Parts: body.CompletedParts,
      },
      ACL: 'public-read',
    };

    return await s3Client.send(
      new CompleteMultipartUploadCommand(multipartParams),
    );
  }

  async uploadFileToS3(image: Express.Multer.File, fileName: string) {
    const s3 = this.getClient();

    const uploadParams: PutObjectCommandInput = {
      Bucket: this.configService.get(EConfiguration.AWS_S3_BUCKET),
      Key: fileName,
      Body: image.buffer,
      ContentType: image.mimetype,
    };

    try {
      return await s3.send(new PutObjectCommand(uploadParams));
    } catch (err) {
      console.error(err);
      throw new HttpException(
        ErrorMessage.UPLOAD_S3_FAIL,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteFileToS3(fileName: string) {
    const s3 = this.getClient();

    const deleteParams: DeleteObjectCommandInput = {
      Bucket: this.configService.get(EConfiguration.AWS_S3_BUCKET),
      Key: fileName,
    };

    try {
      return await s3.send(new DeleteObjectCommand(deleteParams));
    } catch (err) {
      throw new HttpException(
        ErrorMessage.UPLOAD_S3_FAIL,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * @param files
   * @param folder
   * @returns
   */
  async uploadS3V2(files: Array<Express.Multer.File>, body: VUploadBody) {
    const { unGenerateName } = body;
    const data = [];

    for (const file of files) {
      const md5FileName = Md5.hashStr(file.originalname);
      const fileName =
        unGenerateName === '1'
          ? `${file.originalname}@@${md5FileName}.${this.getFileExtension(
              file.originalname,
            )}`
          : `${Date.now().toString()}-${md5FileName}`;

      await this.uploadFileToS3(file, fileName);

      data.push({
        url: fileName,
      });
    }

    return data;
  }

  getFileExtension(fileName: string) {
    const lastDotIndex = fileName.lastIndexOf('.');
    if (lastDotIndex === -1) {
      return ''; //
    }
    return fileName.slice(lastDotIndex + 1);
  }
  /**
   * Solution 1
   * @param files
   * @param folder
   * @returns
   */
  async uploadS3V2Thumbnail(files: Array<Express.Multer.File>, folder: string) {
    const data = [];

    for (const file of files) {
      const md5FileName = Md5.hashStr(file.originalname);
      const fileName = `${folder}/${Date.now().toString()}-${md5FileName}`;

      const thumbnails = await this.saveS3AndThumbnail(file, fileName);

      data.push({
        image_url: `${this.configService.get<string>(
          EConfiguration.AWS_S3_URL,
        )}/${fileName}`,
        thumbnail_url: `${this.configService.get<string>(
          EConfiguration.AWS_S3_URL,
        )}/${thumbnails[0]}`,
      });
    }

    return data;
  }

  async saveS3AndThumbnail(
    image: Express.Multer.File,
    fileName: string,
  ): Promise<Array<string>> {
    await this.uploadFileToS3(image, fileName);

    if (
      image.originalname.search(
        /\.(gif|jpe?g|tiff|png|webp|bmp|svg|HEIC)$/gi,
      ) !== -1
    ) {
      await this.generateThumb(image, fileName);
      const putObjects = image['thumbs'].map((item) => {
        return this.uploadFileToS3(item, item.fieldName);
      });

      await Promise.all(putObjects);

      return image['thumbs'].map((item) => item.fileName);
    }
  }

  async deleteS3(keys: Array<string>) {
    const bulkDelete = [];

    keys.forEach((key) => {
      bulkDelete.push(this.deleteFileToS3(this.getKeyFromUrl(key)));
    });

    await Promise.all(bulkDelete);
  }

  async generateThumb(image: Express.Multer.File, fileName: string) {
    // eslint-disable-next-line no-console
    console.log(image);
    // eslint-disable-next-line no-console
    console.log(fileName);
    // const img = sharp(image.buffer);
    // // eslint-disable-next-line prefer-const
    // let { width, height, orientation } = await img.metadata();
    // if (width >= height && width > 300) {
    //   height = Math.round((height * 300) / width);
    //   width = 300;
    // } else if (height > width && height > 300) {
    //   width = Math.round((width * 300) / height);
    //   height = 300;
    // }
    // if (orientation && orientation % 2 === 0) {
    //   [width, height] = [height, width];
    // }
    // let bufferData = image.buffer;
    // if (width && height) {
    //   bufferData = await sharp(image.buffer)
    //     .resize(Number(width), Number(height), {
    //       withoutEnlargement: true,
    //       fit: 'inside',
    //     })
    //     .toBuffer();
    //   if (!image['thumbs'] || !Array.isArray(image['thumbs']))
    //     image['thumbs'] = [];
    //   image['thumbs'].push({
    //     // fileName: `${width}x${height}/${fileName}`,
    //     fileName: `thumbnail/${fileName}`,
    //     bufferData,
    //   });
    // }
  }

  getKeyFromUrl(url: string) {
    const pathUrl =
      /^(?:https?:\/\/)?(?:[^@\\/\n]+@)?(?:www\.)?([^:\\/?\n]+)/gim;

    if (!url.startsWith('http') && !url.startsWith('https')) return url;

    return url.replace(pathUrl, '').replace(/^\//, '');
  }
}
