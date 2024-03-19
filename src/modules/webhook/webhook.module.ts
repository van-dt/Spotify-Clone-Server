import { Module } from '@nestjs/common';

import { SesModule } from '@core/global/ses/ses.module';

import { WebhookController } from './webhook.controller';
import { WebhookService } from './webhook.service';

@Module({
  controllers: [WebhookController],
  providers: [WebhookService],
  imports: [SesModule],
})
export class WebhookModule {}
