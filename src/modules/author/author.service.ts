import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../core/global/prisma/prisma.service';

import { CreateAuthorDto } from './dto/create-author.dto';
import { FindAllAuthorFilterDto } from './dto/find-author.dto';

@Injectable()
export class AuthorService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createAuthorDto: CreateAuthorDto) {
    return await this.prisma.author.create({
      data: createAuthorDto,
      select: {
        id: true,
        authorName: true,
        image: true,
      },
    });
  }

  async findAll(filter: FindAllAuthorFilterDto) {
    return await this.prisma.author.findMany({
      select: {
        id: true,
        authorName: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
      where: {
        authorName: {
          contains: filter.name,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: number) {
    return await this.prisma.author.findFirst({
      select: {
        id: true,
        authorName: true,
        image: true,
        createdAt: true,
        updatedAt: true,
        songs: {
          select: {
            id: true,
            title: true,
            songPath: true,
            imagePath: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
      where: {
        id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  remove(id: number) {
    return `This action removes a #${id} author`;
  }
}
