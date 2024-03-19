import { CacheModule, CacheModuleOptions } from '@nestjs/cache-manager';
import { Module, HttpException, HttpStatus, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';

import { EConfiguration } from '@core/config';

import { RedisCacheService } from './redis.service';

type TCacheModuleOptions = Omit<CacheModuleOptions, 'store'> & {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  store: any;
};

function geRedisConnectionOptions(config: ConfigService): TCacheModuleOptions {
  const host = config.get(EConfiguration.DB_REDIS_HOST);
  const port = config.get(EConfiguration.DB_REDIS_PORT);
  const ttl = config.get(EConfiguration.DB_REDIS_TTL);

  if (!host || !port) {
    throw new HttpException('redis config is missing', HttpStatus.NOT_FOUND);
  }

  return {
    store: redisStore,
    host: host,
    port: port,
    ttl: ttl || 0,
    isGlobal: true,
  };
}

@Global()
@Module({
  controllers: [],
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) =>
        geRedisConnectionOptions(configService),
      inject: [ConfigService],
    }),
  ],
  providers: [RedisCacheService],
  exports: [RedisCacheService],
})
export class RedisCacheModule {}
