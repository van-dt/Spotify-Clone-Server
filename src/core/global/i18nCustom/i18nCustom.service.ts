/* eslint-disable @typescript-eslint/ban-types */
import { Injectable, Logger } from '@nestjs/common';
import { I18nContext, I18nService } from 'nestjs-i18n';

import { ConstanceService } from '../constance/constance.service';

@Injectable()
export class I18nCustomService {
  private readonly logger = new Logger('I18nCustomService');
  constructor(
    private readonly i18n: I18nService,
    private readonly constanceService: ConstanceService,
  ) {}

  async translate(key: string) {
    return await this.i18n.t(key, {
      lang: I18nContext.current().lang,
    });
  }
}
