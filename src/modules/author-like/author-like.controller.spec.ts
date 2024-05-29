import { Test, TestingModule } from '@nestjs/testing';

import { AuthorLikeController } from './author-like.controller';
import { AuthorLikeService } from './author-like.service';

describe('AuthorLikeController', () => {
  let controller: AuthorLikeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthorLikeController],
      providers: [AuthorLikeService],
    }).compile();

    controller = module.get<AuthorLikeController>(AuthorLikeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
