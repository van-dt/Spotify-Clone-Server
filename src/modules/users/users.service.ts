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
      },
    });
    return user;
  }

  update(currentUserId: number, id: number, updateUserDto: UpdateUserDto) {
    if (currentUserId !== id) {
      throw new HttpException(
        `User can not update other user's profile`,
        HttpStatus.FORBIDDEN,
      );
    }
    return this.prisma.user.update({
      where: {
        id,
      },
      data: updateUserDto,
    });
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
