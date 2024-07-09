import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';

import { Roles, UserData } from '../../core/decorator';
import { ERole } from '../../core/enum';
import { IUserData } from '../../core/interface';

import { AddSongToPlaylistDto } from './dto/add-song-to-playlist.dto';
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

  @Post('/add-song')
  addSongToPlaylist(
    @UserData() user: IUserData,
    @Body() addSongToPlaylistDto: AddSongToPlaylistDto,
  ) {
    return this.playlistsService.addSongToPlaylist(
      addSongToPlaylistDto,
      user.uid,
    );
  }

  @Put(':id')
  update(
    @UserData() user: IUserData,
    @Param('id') id: string,
    @Body() updatePlaylistDto: UpdatePlaylistDto,
  ) {
    return this.playlistsService.update(user.uid, +id, updatePlaylistDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.playlistsService.remove(+id);
  }
}
