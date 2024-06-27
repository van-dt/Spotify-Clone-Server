import { join } from 'path';

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerDocumentOptions, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import * as dotenv from 'dotenv';
import { urlencoded, json } from 'express';
import helmet from 'helmet';
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';
import * as winston from 'winston';

import { handleInitSwagger } from '@core/swagger';
import { getWinstonFormat, getWinstonPathFile } from '@helper/utils';

import { AppModule } from './app.module';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: WinstonModule.createLogger({
      format: getWinstonFormat(),
      transports: [
        getWinstonPathFile(),
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            nestWinstonModuleUtilities.format.nestLike(),
          ),
        }),
      ],
    }),
    rawBody: true,
  });

  app.setGlobalPrefix('api/v1', { exclude: ['/healthcheck'] });

  if (process.env.NODE_ENV === 'local') {
    const swaggerConfig = handleInitSwagger();

    const options: SwaggerDocumentOptions = {
      operationIdFactory: (controllerKey: string, methodKey: string) =>
        methodKey,
    };
    const document = SwaggerModule.createDocument(app, swaggerConfig, options);

    SwaggerModule.setup('openapi', app, document);
  }

  app.use(helmet());
  app.enableCors({
    origin: ['http://localhost:3000', 'https://music-player-system.vercel.app'],
    credentials: true,
  });

  // somewhere in your initialization file
  app.use(cookieParser());
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));
  app.useStaticAssets(join(__dirname, '..', 'static'));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // TODO on port env
  const port = process.env.PORT || 3009;
  await app.listen(port);
  console.info(`\nServer is running on port ${port}\n`);
}

bootstrap();
