import { Test, TestingModule } from '@nestjs/testing';

import { SongLikeService } from './song-like.service';

describe('SongLikeService', () => {
  let service: SongLikeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SongLikeService],
    }).compile();

    service = module.get<SongLikeService>(SongLikeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
