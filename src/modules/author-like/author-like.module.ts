import { Module } from '@nestjs/common';

import { AuthorLikeController } from './author-like.controller';
import { AuthorLikeService } from './author-like.service';

@Module({
  controllers: [AuthorLikeController],
  providers: [AuthorLikeService],
})
export class AuthorLikeModule {}
