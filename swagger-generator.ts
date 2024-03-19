import { NestFactory } from '@nestjs/core';
import { SwaggerDocumentOptions, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './src/app.module';
import { handleInitSwagger } from './src/core/swagger';
import { writeFileSync } from 'fs';

async function generateSwagger() {
  const app = await NestFactory.create(AppModule);

  const swaggerConfig = handleInitSwagger();

  const options: SwaggerDocumentOptions = {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  };
  const document = SwaggerModule.createDocument(app, swaggerConfig, options);
  writeFileSync('./swagger.json', JSON.stringify(document));
  await app.close();
  process.exit(0);
}

generateSwagger();
