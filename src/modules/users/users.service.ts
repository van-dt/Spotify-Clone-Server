import * as fs from 'fs';

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { PrismaService } from '../../core/global/prisma/prisma.service';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  create(_createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all users`;
  }

  async getMyProfile(userId: number) {
    const user = await this.prisma.user.findFirstOrThrow({
      where: {
        id: userId,
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        avatarUrl: true,
        bio: true,
      },
    });
    return user;
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findFirstOrThrow({
      where: {
        id,
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        avatarUrl: true,
        bio: true,
      },
    });
    return user;
  }

  async update(
    currentUserId: number,
    id: number,
    updateUserDto: UpdateUserDto,
  ) {
    if (currentUserId !== id) {
      throw new HttpException(
        `User can not update other user's profile`,
        HttpStatus.FORBIDDEN,
      );
    }

    const userExist = await this.prisma.user.findFirstOrThrow({
      where: { id },
    });

    if (
      updateUserDto.avatarUrl &&
      updateUserDto.avatarUrl !== userExist.avatarUrl &&
      userExist.avatarUrl
    ) {
      const fileImagePath = userExist.avatarUrl.replace(
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
    }

    return this.prisma.user.update({
      where: {
        id,
      },
      data: updateUserDto,
      select: {
        id: true,
        email: true,
        fullName: true,
        avatarUrl: true,
        bio: true,
      },
    });
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
