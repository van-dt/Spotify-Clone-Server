import { createReadStream, statSync } from 'fs';
import { join } from 'path';

import {
  Controller,
  Get,
  Header,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

import {
  audioFileFilter,
  editFileName,
  imageFileFilter,
} from '../../helper/utils';

import { UploadService } from './upload.service';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('/image')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './files/images',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  async uploadedImageFile(@UploadedFile() file) {
    const response = {
      originalname: file.originalname,
      filename: file.filename,
    };
    return response;
  }

  @Get('/image/:imgPath')
  seeUploadedImageFile(@Param('imgPath') image, @Res() res) {
    return res.sendFile(image, { root: './files/images' });
  }

  @Post('/song')
  @UseInterceptors(
    FileInterceptor('song', {
      storage: diskStorage({
        destination: './files/songs',
        filename: editFileName,
      }),
      fileFilter: audioFileFilter,
    }),
  )
  async uploadedAudioFile(@UploadedFile() file) {
    const response = {
      originalname: file.originalname,
      filename: file.filename,
    };
    return response;
  }

  @Get('/song/:songPath')
  @Header('Accept-Ranges', 'bytes')
  seeUploadedAudioFile(@Param('songPath') song, @Res() res) {
    const filePath = join(__dirname, `../../../../files/songs/${song}`);
    const stat = statSync(filePath);

    if (!stat) {
      throw new HttpException('File not found', HttpStatus.NOT_FOUND);
    }

    const { range } = res.req.headers;

    const fileSize = stat.size;
    const start = range
      ? parseInt(range.replace(/bytes=/, '').split('-')[0], 10)
      : 0;
    const end = range
      ? parseInt(range.replace(/bytes=/, '').split('-')[1], 10) || fileSize - 1
      : fileSize - 1;

    const chunkSize = end - start + 1;

    res.status(206).header({
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Content-Length': chunkSize,
      'Content-Type': 'audio/mpeg',
    });

    const fileStream = createReadStream(filePath, { start, end });
    fileStream.pipe(res);
  }
}
