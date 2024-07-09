import * as fs from 'fs';

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { PrismaService } from '../../core/global/prisma/prisma.service';

import { CreateSongDto } from './dto/create-song.dto';
import { FindAllPostFilterDto } from './dto/find-song.dto';
import { UpdateSongDto } from './dto/update-song.dto';

@Injectable()
export class SongsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createSongDto: CreateSongDto, userId: number) {
    const { categoryIds, ...dataCreate } = createSongDto;

    const song = await this.prisma.song.create({
      data: { ...dataCreate, userId },
      select: {
        id: true,
        title: true,
        songPath: true,
        imagePath: true,
      },
    });

    if (categoryIds.length > 0) {
      await this.prisma.songCategory.createMany({
        data: categoryIds.map((categoryId) => ({
          songId: song.id,
          categoryId,
        })),
      });
    }

    return song;
  }

  async findAll(filter: FindAllPostFilterDto) {
    if (filter.title) {
      const searchQuery = `%${filter.title}%`;
      const results: { id: number }[] = await this.prisma.$queryRaw`
        SELECT
          id
        FROM
          song
        WHERE
          unaccent(lower(title)) ILIKE unaccent(lower(${searchQuery}));
      `;
      const songIds = results.map((result) => result.id);
      const songs = await this.prisma.song.findMany({
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
        where: {
          id: {
            in: songIds,
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return songs.map((song) => {
        const { songCategories, ...songRes } = song;
        const categories = songCategories.map(
          (songCategory) => songCategory.category.categoryName,
        );
        return { ...songRes, categories };
      });
    }

    const songs = await this.prisma.song.findMany({
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
      orderBy: {
        createdAt: 'desc',
      },
    });

    return songs.map((song) => {
      const { songCategories, ...songRes } = song;
      const categories = songCategories.map(
        (songCategory) => songCategory.category.categoryName,
      );
      return { ...songRes, categories };
    });
  }

  async getSongsByUserId(userId: number) {
    const user = await this.prisma.user.findFirstOrThrow({
      where: {
        id: userId,
      },
      select: {
        songs: {
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
    });
    return user.songs;
  }

  async getLikedSongs(userId: number) {
    const songLikes = await this.prisma.likedSong.findMany({
      where: {
        userId,
      },
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

  async remove(id: number, userId: number) {
    const songExist = await this.prisma.song.findFirstOrThrow({
      where: {
        id,
      },
    });

    if (userId !== songExist.userId) {
      throw new HttpException(
        `User can not delete other user's song`,
        HttpStatus.FORBIDDEN,
      );
    }

    const fileSongPath = songExist.songPath.replace(
      '/upload/song/',
      'files/songs/',
    );
    fs.unlink(fileSongPath, (err) => {
      if (err) {
        console.error(`${JSON.stringify(err)}`);
        throw new HttpException(
          'Song file deleted error',
          HttpStatus.BAD_REQUEST,
        );
      }
    });

    const fileImagePath = songExist.imagePath.replace(
      '/upload/image/',
      'files/images/',
    );
    fs.unlink(fileImagePath, (err) => {
      if (err) {
        console.error(`${JSON.stringify(err)}`);
        throw new HttpException(
          'Image file deleted error',
          HttpStatus.BAD_REQUEST,
        );
      }
    });

    return this.prisma.song.delete({ where: { id } });
  }
}
