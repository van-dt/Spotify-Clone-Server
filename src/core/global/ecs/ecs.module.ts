import { Global, Module } from '@nestjs/common';

import { EcsService } from './ecs.service';

@Global()
@Module({
  providers: [EcsService],
  exports: [EcsService],
})
export class EcsModule {}
