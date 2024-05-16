import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';

import { Roles, UserData } from '../../core/decorator';
import { ERole } from '../../core/enum';
import { IUserData } from '../../core/interface';

import { CreateSongLikeDto } from './dto/create-song-like.dto';
import { SongLikeService } from './song-like.service';

@Controller('song-like')
export class SongLikeController {
  constructor(private readonly songLikeService: SongLikeService) {}

  @Roles([ERole.USER])
  @Post()
  create(
    @Body() createSongLikeDto: CreateSongLikeDto,
    @UserData() user: IUserData,
  ) {
    return this.songLikeService.create(createSongLikeDto, user.uid);
  }

  @Get()
  findAll() {
    return this.songLikeService.findAll();
  }

  @Roles([ERole.USER])
  @Get('/song/:songId')
  checkIsLiked(@Param('songId') songId: string, @UserData() user: IUserData) {
    return this.songLikeService.checkIsLiked(+songId, user.uid);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.songLikeService.findOne(+id);
  }

  @Roles([ERole.USER])
  @Delete(':songId')
  remove(@Param('songId') songId: string, @UserData() user: IUserData) {
    return this.songLikeService.remove(+songId, user.uid);
  }
}
