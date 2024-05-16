import { Module } from '@nestjs/common';

import { SongLikeController } from './song-like.controller';
import { SongLikeService } from './song-like.service';

@Module({
  controllers: [SongLikeController],
  providers: [SongLikeService],
})
export class SongLikeModule {}
