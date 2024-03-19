import { BullModule } from '@nestjs/bull';
import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { EConfiguration } from '@core/config';

@Global()
@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get(EConfiguration.DB_REDIS_HOST),
          port: +configService.get(EConfiguration.DB_REDIS_PORT),
        },
      }),
      inject: [ConfigService],
    }),
  ],
})
export class QueueModule {}
