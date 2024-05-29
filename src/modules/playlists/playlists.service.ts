import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../core/global/prisma/prisma.service';

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
    return await this.prisma.playlist.findMany({
      select: {
        id: true,
        playlistName: true,
        image: true,
        banner: true,
        createdAt: true,
        updatedAt: true,
      },
      where: {
        userId,
      },
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

  update(id: number, updatePlaylistDto: UpdatePlaylistDto) {
    return `This action updates a #${id} playlist ${JSON.stringify(updatePlaylistDto)}`;
  }

  remove(id: number) {
    return `This action removes a #${id} playlist`;
  }
}
