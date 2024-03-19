import { BullModule } from '@nestjs/bull';
import { Global, Module } from '@nestjs/common';

import { SendMailTempleUpdateEventConsumer } from './consumer/sendMailTempleUpdateEvent.processor';
import { QUEUE_MODULE_OPTIONS } from './queueIdentity.constant';
import { QueueProcessorService } from './queueProcessor.service';

@Global()
@Module({
  providers: [QueueProcessorService, SendMailTempleUpdateEventConsumer],
  imports: [
    BullModule.registerQueue({
      name: QUEUE_MODULE_OPTIONS.SEND_MAIL_TEMPLE_UPDATE_EVENT.NAME,
    }),
    //**modules service */
  ],
  exports: [QueueProcessorService, SendMailTempleUpdateEventConsumer],
})
export class QueueProcessorModule {}
