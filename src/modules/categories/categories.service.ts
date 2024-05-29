import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../core/global/prisma/prisma.service';

import { CreateCategoryDto } from './dto/create-category.dto';
import { FindAllCategoryFilterDto } from './dto/find-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto) {
    return await this.prisma.category.create({
      data: createCategoryDto,
      select: {
        id: true,
        categoryName: true,
        image: true,
        banner: true,
      },
    });
  }

  async findAll(filter: FindAllCategoryFilterDto) {
    return await this.prisma.category.findMany({
      select: {
        id: true,
        categoryName: true,
        image: true,
        banner: true,
        createdAt: true,
        updatedAt: true,
      },
      where: {
        categoryName: {
          contains: filter.name,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: number) {
    const category = await this.prisma.category.findFirst({
      select: {
        id: true,
        categoryName: true,
        image: true,
        banner: true,
        createdAt: true,
        updatedAt: true,
        songCategories: {
          select: {
            song: {
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
        },
      },
      where: {
        id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const { songCategories, ...categoryRes } = category;
    const songs = songCategories.map((songCategory) => songCategory.song);
    return {
      ...categoryRes,
      songs,
    };
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
