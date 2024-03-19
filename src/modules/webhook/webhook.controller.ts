import { Body, Controller, Post } from '@nestjs/common';

import { Public } from '@core/decorator';
import { VSesWebhookDto } from '@core/global/ses/dto/ses-webhook.dto';

import { WebhookService } from './webhook.service';

@Controller('')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Public()
  @Post('ses')
  sesWebhook(@Body() body: VSesWebhookDto) {
    return this.webhookService.sesWebhook(body);
  }
}
