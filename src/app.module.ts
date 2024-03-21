// import { RedisHealthModule } from '@liaoliaots/nestjs-redis-health';
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { TerminusModule } from '@nestjs/terminus';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

import { configuration } from '@core/config';
import { JwtAuthGuard } from '@core/global/auth/guard/jwtAuth.guard';
import { RolesGuard } from '@core/global/auth/guard/roles.guard';
import { ConstanceModule } from '@core/global/constance/constance.module';
import { EcsModule } from '@core/global/ecs/ecs.module';
import { I18nCustomModule } from '@core/global/i18nCustom/i18nCustom.module';
import { PrismaModule } from '@core/global/prisma/prisma.module';
// import { QueueModule } from '@core/global/queue/queue.module';
// import { QueueProcessorModule } from '@core/global/queueProcessor/queueProcessor.module';
// import { RedisCacheModule } from '@core/global/redis/redis.module';
import { SesModule } from '@core/global/ses/ses.module';
import { UploadModule } from '@core/global/upload/upload.module';
import { DisableGuard } from '@core/guard/disable.guard';
import { PostInterceptor, ResponseInterceptor } from '@core/interceptor';
// import { validate } from '@helper/env.validation';
import { HttpExceptionFilter } from '@helper/httpException.filter';
import { LoggerMiddleware } from '@helper/logger.middleware';
import { ExampleModule } from '@modules/example/example.module';
import { WebhookModule } from '@modules/webhook/webhook.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './core/global/auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    PrismaModule,
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
      // TODO: we 'll remove validate env for docker build image + github action smoothly
      // validate,
    }),
    I18nCustomModule,
    // RedisCacheModule,
    ConstanceModule,
    // QueueModule,
    UploadModule,
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 1000,
    }),
    // QueueProcessorModule,
    SesModule,
    WebhookModule,
    TerminusModule,
    // RedisHealthModule,
    EcsModule,
    ExampleModule,
    // my app
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: PostInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: DisableGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
