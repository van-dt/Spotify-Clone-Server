import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { EConfiguration } from '@core/config';
import { EAppLanguage, EEnvironment } from '@core/enum';
import { IKeyRedisCache } from '@core/interface';

@Injectable()
export class ConstanceService {
  private appName: string;
  private environment: EEnvironment;
  private fallbackLanguage: EAppLanguage;

  constructor(private configService: ConfigService) {
    this.appName = configService.get(EConfiguration.APP_NAME);
    this.environment = configService.get(EConfiguration.ENVIRONMENT);
    this.fallbackLanguage = EAppLanguage.JA;
  }

  getKeyCacheRedis(): IKeyRedisCache {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const vm = this;
    return {
      RESOURCE: `${this.appName}:${this.environment}:resource`,
      CUSTOMERS_BLOCKED: {
        name: function (customerId: number) {
          return `${vm.appName}:${vm.environment}:${customerId}:customer-blocked`;
        },
      },
    };
  }

  getSecretKeyToken() {
    return this.configService.get(EConfiguration.AUTH_SECRET_KEY);
  }

  getFallbackLanguage() {
    return this.fallbackLanguage;
  }
  setFallbackLanguage(language: EAppLanguage) {
    this.fallbackLanguage = language;
  }
}
