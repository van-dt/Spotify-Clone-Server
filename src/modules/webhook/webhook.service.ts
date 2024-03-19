import { Injectable } from '@nestjs/common';

import { VSesWebhookDto } from '@core/global/ses/dto/ses-webhook.dto';
import { SesService } from '@core/global/ses/ses.service';

@Injectable()
export class WebhookService {
  constructor(private sesService: SesService) {}

  async sesWebhook(body: VSesWebhookDto) {
    return await this.sesService.sesWebhook(body);
  }
}
