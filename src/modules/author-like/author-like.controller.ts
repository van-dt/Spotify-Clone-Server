import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';

import { Roles, UserData } from '../../core/decorator';
import { ERole } from '../../core/enum';
import { IUserData } from '../../core/interface';

import { AuthorLikeService } from './author-like.service';
import { CreateAuthorLikeDto } from './dto/create-author-like.dto';

@Controller('author-like')
export class AuthorLikeController {
  constructor(private readonly authorLikeService: AuthorLikeService) {}

  @Roles([ERole.USER])
  @Post()
  create(
    @Body() createAuthorLikeDto: CreateAuthorLikeDto,
    @UserData() user: IUserData,
  ) {
    return this.authorLikeService.create(createAuthorLikeDto, user.uid);
  }

  @Get()
  findAll() {
    return this.authorLikeService.findAll();
  }

  @Roles([ERole.USER])
  @Get('/author/:authorId')
  checkIsLiked(
    @Param('authorId') authorId: string,
    @UserData() user: IUserData,
  ) {
    return this.authorLikeService.checkIsLiked(+authorId, user.uid);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authorLikeService.findOne(+id);
  }

  @Roles([ERole.USER])
  @Delete(':authorId')
  remove(@Param('authorId') authorId: string, @UserData() user: IUserData) {
    return this.authorLikeService.remove(+authorId, user.uid);
  }
}
