import {
  Controller,
  Get,
  Post,
  Param,
  UploadedFile,
  UseInterceptors,
  Res,
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
  seeUploadedAudioFile(@Param('songPath') song, @Res() res) {
    return res.sendFile(song, { root: './files/songs' });
  }
}
