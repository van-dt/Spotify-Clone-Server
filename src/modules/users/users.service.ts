import { Injectable } from '@nestjs/common';

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

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, _updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
