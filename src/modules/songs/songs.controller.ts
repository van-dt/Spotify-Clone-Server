import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';

import { Roles, UserData } from '../../core/decorator';
import { ERole } from '../../core/enum';
import { IUserData } from '../../core/interface';

import { CreateSongDto } from './dto/create-song.dto';
import {
  FindAllPostFilterDto,
  FindAllPostFilterParams,
} from './dto/find-song.dto';
import { UpdateSongDto } from './dto/update-song.dto';
import { SongsService } from './songs.service';

@Controller('songs')
export class SongsController {
  constructor(private readonly songsService: SongsService) {}

  @Roles([ERole.USER])
  @Post()
  async create(
    @UserData() user: IUserData,
    @Body() createSongDto: CreateSongDto,
  ) {
    return await this.songsService.create(createSongDto, user.uid);
  }

  @Get()
  async findAll(@FindAllPostFilterParams() filter: FindAllPostFilterDto) {
    return await this.songsService.findAll(filter);
  }

  @Roles([ERole.USER])
  @Get('/users')
  async getSongsByUserId(@UserData() user: IUserData) {
    return await this.songsService.getSongsByUserId(user.uid);
  }

  @Roles([ERole.USER])
  @Get('/liked')
  async getLikedSongs(@UserData() user: IUserData) {
    return await this.songsService.getLikedSongs(user.uid);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.songsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSongDto: UpdateSongDto) {
    return this.songsService.update(+id, updateSongDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.songsService.remove(+id);
  }
}
