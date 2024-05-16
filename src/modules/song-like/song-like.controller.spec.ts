import { Test, TestingModule } from '@nestjs/testing';

import { SongLikeController } from './song-like.controller';
import { SongLikeService } from './song-like.service';

describe('SongLikeController', () => {
  let controller: SongLikeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SongLikeController],
      providers: [SongLikeService],
    }).compile();

    controller = module.get<SongLikeController>(SongLikeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
