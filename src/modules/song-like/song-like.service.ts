import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../../core/global/prisma/prisma.service';

import { CreateSongLikeDto } from './dto/create-song-like.dto';

@Injectable()
export class SongLikeService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createSongLikeDto: CreateSongLikeDto, userId: number) {
    const songLike = await this.prisma.likedSong.findFirst({
      where: {
        userId,
        songId: createSongLikeDto.songId,
      },
    });
    if (songLike) return songLike;
    return await this.prisma.likedSong.create({
      data: {
        ...createSongLikeDto,
        userId,
      },
    });
  }

  findAll() {
    return `This action returns all songLike`;
  }

  async checkIsLiked(songId: number, userId: number) {
    const songLike = await this.prisma.likedSong.findFirst({
      where: {
        userId,
        songId,
      },
    });

    return {
      isLiked: !!songLike,
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} songLike`;
  }

  async remove(songId: number, userId: number) {
    const songLike = await this.prisma.likedSong.findFirst({
      where: {
        userId,
        songId,
      },
    });
    if (!songLike)
      throw new NotFoundException(`Song with id ${songId} has not been liked`);
    return this.prisma.likedSong.delete({
      where: {
        userId_songId: {
          userId,
          songId,
        },
      },
    });
  }
}
