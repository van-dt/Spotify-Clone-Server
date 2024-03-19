// import { RedisHealthIndicator } from '@liaoliaots/nestjs-redis-health';
import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HealthCheckService } from '@nestjs/terminus';
// import { Redis } from 'ioredis';

import { EConfiguration } from '@core/config';
import { ErrorMessage } from '@core/enum';

@Injectable()
export class AppService implements OnModuleInit {
  private readonly logger = new Logger('AppService');
  // private readonly redisIO: Redis;

  constructor(
    private readonly health: HealthCheckService,
    // private readonly redisIndicator: RedisHealthIndicator,
    private configService: ConfigService,
  ) {
    // this.redisIO = new Redis({
    //   host: this.configService.get('DB_REDIS_HOST') || 'localhost',
    //   port: this.configService.get('DB_REDIS_PORT') || 6379,
    // });
  }

  async onModuleInit() {
    if (this.configService.get(EConfiguration.DB_POSTGRES_TRIGGER)) {
      this.logger.log(`*****************OnModuleInit******************`);
      this.logger.log(
        `*****************TriggerPostgresqlInit******************`,
      );
      // const manager = getManager();
      // //example sql script trigger
      // const sqlDropTriggerUpdateMCategory =
      //   'DROP TRIGGER IF EXISTS after_update_m_category';
      // const sqlCreateTriggerDeleteMWhatToExpect =
      //   "CREATE TRIGGER after_delete_m_what_to_expect AFTER DELETE ON m_what_to_expect FOR EACH ROW INSERT INTO data_version SET action = 'delete'";
      // try {
      //   await Promise.all([manager.query(sqlDropTriggerUpdateMCategory)]);
      //   await Promise.all([manager.query(sqlCreateTriggerDeleteMWhatToExpect)]);
      // } catch (error) {
      //   console.log(error);
      // }
    }
  }

  getHello(): string {
    // throw new HttpException(
    //   ErrorMessage.ACCOUNT_NOT_EXISTS,
    //   HttpStatus.BAD_REQUEST,
    // );

    return 'Hello from Spotify Clone!';
  }

  redisHealthChecks() {
    return 'ok';
    // return await this.health.check([
    //   () =>
    //     this.redisIndicator.checkHealth('redis', {
    //       type: 'redis',
    //       client: this.redisIO,
    //       timeout: 500,
    //     }),
    // ]);
  }
}
