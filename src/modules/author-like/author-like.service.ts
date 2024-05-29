import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../../core/global/prisma/prisma.service';

import { CreateAuthorLikeDto } from './dto/create-author-like.dto';

@Injectable()
export class AuthorLikeService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createAuthorLikeDto: CreateAuthorLikeDto, userId: number) {
    const authorLike = await this.prisma.likedAuthor.findFirst({
      where: {
        userId,
        authorId: createAuthorLikeDto.authorId,
      },
    });
    if (authorLike) return authorLike;
    return await this.prisma.likedAuthor.create({
      data: {
        ...createAuthorLikeDto,
        userId,
      },
    });
  }

  findAll() {
    return `This action returns all authorLike`;
  }

  async checkIsLiked(authorId: number, userId: number) {
    const authorLike = await this.prisma.likedAuthor.findFirst({
      where: {
        userId,
        authorId,
      },
    });

    return {
      isLiked: !!authorLike,
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} authorLike`;
  }

  async remove(authorId: number, userId: number) {
    const authorLike = await this.prisma.likedAuthor.findFirst({
      where: {
        userId,
        authorId,
      },
    });
    if (!authorLike)
      throw new NotFoundException(
        `Author with id ${authorId} has not been liked`,
      );
    return this.prisma.likedAuthor.delete({
      where: {
        userId_authorId: {
          userId,
          authorId,
        },
      },
    });
  }
}
