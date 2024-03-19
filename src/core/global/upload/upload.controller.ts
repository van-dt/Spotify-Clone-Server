import { createReadStream } from 'fs';
import { join } from 'path';

import {
  Controller,
  Get,
  Post,
  Param,
  UseInterceptors,
  UploadedFiles,
  UploadedFile,
  Res,
  StreamableFile,
  Body,
  Put,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

import { Public } from '@core/decorator';
import { allFileFilter, editFileName, imageFileFilter } from '@helper/utils';

import { VDeleteBody, VUploadBody } from './dto';
import { VCompleteUploadBody } from './dto/complete-multi-upload.dto';
import { VPreSignedUrlsBody } from './dto/getSignedUrl.dto';
import { UploadService } from './upload.service';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Public()
  @Post()
  @UseInterceptors(
    FilesInterceptor('files', 12, {
      fileFilter: imageFileFilter,
    }),
  )
  async uploadS3V2(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() body: VUploadBody,
  ) {
    return await this.uploadService.uploadS3V2(files, body);
  }

  @Public()
  @Post('message')
  @UseInterceptors(
    FilesInterceptor('files', 12, {
      fileFilter: allFileFilter,
    }),
  )
  async messageUpload(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() body: VUploadBody,
  ) {
    return await this.uploadService.uploadS3V2(files, body);
  }

  @Public()
  @Post('init-multipart-upload')
  async initMultipartUpload(@Body() body: VUploadBody) {
    return await this.uploadService.initMultipartUpload(body.unGenerateName);
  }

  @Public()
  @Post('get-signed-url')
  async getMultipartPreSignedUrls(@Body() body: VPreSignedUrlsBody) {
    return await this.uploadService.createS3SignedUrl(body);
  }

  @Public()
  @Post('complete-multipart-upload')
  async completeMultiUpload(@Body() body: VCompleteUploadBody) {
    return await this.uploadService.completeMultiUpload(body);
  }

  @Public()
  @Post()
  @UseInterceptors(
    FilesInterceptor('files', 12, {
      fileFilter: imageFileFilter,
    }),
  )
  async uploadS3V2Thumbnail(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() body: VUploadBody,
  ) {
    return await this.uploadService.uploadS3V2Thumbnail(
      files,
      body.unGenerateName,
    );
  }

  @Public()
  @Put()
  async deleteFileFromS3(@Body() body: VDeleteBody) {
    return await this.uploadService.deleteS3(body.urls);
  }

  @Post('server')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: `${process.cwd()}/static/files`,
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  async uploadedFile(@UploadedFile() file) {
    const response = {
      originalname: file.originalname,
      filename: file.filename,
    };
    return response;
  }

  @Post('multiple-server')
  @UseInterceptors(
    FilesInterceptor('files', 12, {
      storage: diskStorage({
        destination: `${process.cwd()}/static/files`,
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  async uploadMultipleFiles(@UploadedFiles() files) {
    const response = [];
    files.forEach((file) => {
      const fileReponse = {
        originalname: file.originalname,
        filename: file.filename,
      };
      response.push(fileReponse);
    });
    return response;
  }

  @Public()
  @Get(':imgpath')
  seeUploadedFile(@Param('imgpath') image, @Res() res) {
    return res.sendFile(image, { root: `${process.cwd()}/static/files` });
  }

  @Public()
  @Get('test/test')
  getFile(): StreamableFile {
    const file = createReadStream(
      join(process.cwd(), 'static/files/1-d728.jpg'),
    );
    return new StreamableFile(file);
  }
}
