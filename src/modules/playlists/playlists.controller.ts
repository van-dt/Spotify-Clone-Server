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

import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';
import { PlaylistsService } from './playlists.service';

@Roles([ERole.USER])
@Controller('playlists')
export class PlaylistsController {
  constructor(private readonly playlistsService: PlaylistsService) {}

  @Post()
  create(
    @UserData() user: IUserData,
    @Body() createPlaylistDto: CreatePlaylistDto,
  ) {
    return this.playlistsService.create(createPlaylistDto, user.uid);
  }

  @Get()
  findAll(@UserData() user: IUserData) {
    return this.playlistsService.findAll(user.uid);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @UserData() user: IUserData) {
    return this.playlistsService.findOne(+id, user.uid);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePlaylistDto: UpdatePlaylistDto,
  ) {
    return this.playlistsService.update(+id, updatePlaylistDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.playlistsService.remove(+id);
  }
}
