import { Controller, Get } from '@nestjs/common';
import { HealthCheck } from '@nestjs/terminus';

import { Public } from '@core/decorator';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Public()
  @Get('healthcheck')
  @HealthCheck()
  check() {
    return 'ok';
  }

  // @Public()
  // @Get('redis-health')
  // @HealthCheck()
  // async redisHealthChecks(): Promise<HealthCheckResult> {
  //   return await this.appService.redisHealthChecks();
  // }
}
