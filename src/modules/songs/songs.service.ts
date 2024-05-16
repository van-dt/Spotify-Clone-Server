import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../core/global/prisma/prisma.service';

import { CreateSongDto } from './dto/create-song.dto';
import { FindAllPostFilterDto } from './dto/find-song.dto';
import { UpdateSongDto } from './dto/update-song.dto';

@Injectable()
export class SongsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createSongDto: CreateSongDto, userId: number) {
    return await this.prisma.song.create({
      data: { ...createSongDto, userId },
      select: {
        id: true,
        title: true,
        songPath: true,
        imagePath: true,
        author: true,
      },
    });
  }

  async findAll(filter: FindAllPostFilterDto) {
    return await this.prisma.song.findMany({
      select: {
        id: true,
        title: true,
        songPath: true,
        imagePath: true,
        author: true,
        createdAt: true,
      },
      where: {
        title: {
          contains: filter.title,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getSongsByUserId(userId: number) {
    const user = await this.prisma.user.findFirstOrThrow({
      where: {
        id: userId,
      },
      include: {
        songs: true,
      },
    });
    return user.songs;
  }

  async getLikedSongs(userId: number) {
    const songLikes = await this.prisma.likedSong.findMany({
      where: {
        userId,
      },
      select: {
        song: true,
      },
    });

    return songLikes.map((songLike) => songLike.song);
  }

  async findOne(id: number) {
    return await this.prisma.song.findFirstOrThrow({
      where: {
        id,
      },
    });
  }

  update(id: number, _updateSongDto: UpdateSongDto) {
    return `This action updates a #${id} song`;
  }

  remove(id: number) {
    return `This action removes a #${id} song`;
  }
}
