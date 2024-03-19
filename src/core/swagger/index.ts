import { DocumentBuilder, OpenAPIObject } from '@nestjs/swagger';

export function handleInitSwagger(): Omit<OpenAPIObject, 'paths'> {
  const config = new DocumentBuilder()
    .setTitle('API DOCUMENT')
    .setDescription('API description')
    .setVersion('1.0')
    .addTag('Clamin-v1')
    .addBearerAuth(
      {
        description: `[just text field] Please enter token in following format: Bearer <JWT>`,
        name: 'Authorization',
        bearerFormat: 'Bearer',
        scheme: 'Bearer',
        type: 'http',
        in: 'Header',
      },
      'access-token',
    )
    .build();

  return config;
}
