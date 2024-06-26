import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
} from '@nestjs/common';

import { PrismaService } from '../../core/global/prisma/prisma.service';

import { AddSongToPlaylistDto } from './dto/add-song-to-playlist.dto';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';

@Injectable()
export class PlaylistsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createPlaylistDto: CreatePlaylistDto, userId: number) {
    return await this.prisma.playlist.create({
      data: { ...createPlaylistDto, userId },
      select: {
        id: true,
        playlistName: true,
        image: true,
        banner: true,
      },
    });
  }

  async findAll(userId: number) {
    const playlists = await this.prisma.playlist.findMany({
      select: {
        id: true,
        playlistName: true,
        image: true,
        banner: true,
        createdAt: true,
        updatedAt: true,
        songPlaylists: {
          select: {
            song: {
              select: {
                id: true,
                title: true,
                author: {
                  select: {
                    authorName: true,
                  },
                },
                songPath: true,
                imagePath: true,
                createdAt: true,
                updatedAt: true,
              },
            },
          },
        },
      },
      where: {
        userId,
      },
    });

    return playlists.map((playlist) => {
      const { songPlaylists, ...res } = playlist;
      const songs = songPlaylists.map((songPlaylist) => songPlaylist.song);
      return {
        ...res,
        songs,
      };
    });
  }

  async findOne(id: number, userId: number) {
    const playlist = await this.prisma.playlist.findFirst({
      select: {
        id: true,
        playlistName: true,
        image: true,
        banner: true,
        createdAt: true,
        updatedAt: true,
        songPlaylists: {
          select: {
            song: {
              select: {
                id: true,
                title: true,
                author: {
                  select: {
                    authorName: true,
                  },
                },
                songPath: true,
                imagePath: true,
                createdAt: true,
                updatedAt: true,
              },
            },
          },
        },
      },
      where: {
        id,
        userId,
      },
    });

    const { songPlaylists, ...playlistRes } = playlist;
    const songs = songPlaylists.map((songPlaylist) => songPlaylist.song);
    return {
      ...playlistRes,
      songs,
    };
  }

  async addSongToPlaylist(
    addSongToPlaylistDto: AddSongToPlaylistDto,
    userId: number,
  ) {
    const playlist = await this.prisma.playlist.findFirst({
      where: {
        id: addSongToPlaylistDto.playlistId,
      },
      select: {
        userId: true,
        songPlaylists: true,
      },
    });

    if (playlist.userId !== userId) {
      throw new NotAcceptableException(
        'You do not have permission to add song to this playlist!',
      );
    }

    const song = playlist.songPlaylists.find(
      (songPlaylist) => songPlaylist.songId === addSongToPlaylistDto.songId,
    );

    if (song) {
      throw new BadRequestException('This song already existed in playlist!');
    }

    return await this.prisma.songPlaylist.create({
      data: addSongToPlaylistDto,
      select: {
        song: {
          select: {
            id: true,
            title: true,
            songPath: true,
            imagePath: true,
            author: {
              select: {
                authorName: true,
              },
            },
            songCategories: {
              select: {
                category: {
                  select: {
                    categoryName: true,
                  },
                },
              },
            },
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });
  }

  update(id: number, updatePlaylistDto: UpdatePlaylistDto) {
    return `This action updates a #${id} playlist ${JSON.stringify(updatePlaylistDto)}`;
  }

  remove(id: number) {
    return `This action removes a #${id} playlist`;
  }
}