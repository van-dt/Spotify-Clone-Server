import {
  OnQueueActive,
  OnQueueCompleted,
  OnQueueFailed,
  Process,
  Processor,
} from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';

import { SesService } from '@core/global/ses/ses.service';

import { QUEUE_MODULE_OPTIONS } from '../queueIdentity.constant';

@Processor(QUEUE_MODULE_OPTIONS.SEND_MAIL_TEMPLE_UPDATE_EVENT.NAME)
export class SendMailTempleUpdateEventConsumer {
  private readonly logger = new Logger('SendMailTempleUpdateEventConsumer');

  constructor(private sesService: SesService) {}

  @OnQueueActive()
  onQueueActive(job: Job) {
    this.logger.log(`********OnQueueActive Job: ${job.name}`);
  }

  @OnQueueCompleted()
  onQueueCompleted(job: Job) {
    this.logger.log(`********OnQueueCompleted Job: ${job.name}`);
  }

  @OnQueueFailed()
  onQueueFailed(job: Job, err: Error) {
    this.logger.log(`********OnQueueFailed Job: ${job.name}`, err);
  }

  @Process(QUEUE_MODULE_OPTIONS.SEND_MAIL_TEMPLE_UPDATE_EVENT.JOBS.SEND_MAIL)
  async handleSendMailTempleUpdateEvent(job: Job) {
    this.logger.log(`********OnQueueConsumer Job: ${JSON.stringify(job)}`);

    const data = job.data as {
      toAddresses: string[];
      subject: string;
      body: string;
    };

    await this.sesService.sendBulkEmail(data);
  }
}
