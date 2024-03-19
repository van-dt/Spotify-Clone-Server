import { Injectable } from '@nestjs/common';

import { PrismaService } from '@core/global/prisma/prisma.service';
import { IPaginationResponse } from '@core/interface';
import { returnPagingData } from '@helper/utils';

import { VCreateExampleDto } from './dto/createExample.dto';
import { VUpdateExampleDto } from './dto/updateExample.dto';
import { VGetExamplesPropertyResponse } from './swagger/output/getExamples.response';

@Injectable()
export class ExampleService {
  constructor(private readonly prisma: PrismaService) {}

  create(createExampleDto: VCreateExampleDto) {
    return createExampleDto;
  }

  async findAll(): Promise<
    IPaginationResponse<VGetExamplesPropertyResponse[]>
  > {
    const users = await this.prisma.user.findMany({
      include: {
        songs: {
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        id: 'desc',
      },
    });
    return returnPagingData<VGetExamplesPropertyResponse[]>(
      [
        {
          name: users[0]?.fullName || 'example 1',
          age: 10,
        },
        {
          name: 'example 2',
          age: null,
        },
      ],
      10,
      {
        page: 1,
        take: 10,
      },
    );
  }

  findOne(id: number) {
    return `This action returns a #${id} example`;
  }

  update(id: number, updateExampleDto: VUpdateExampleDto) {
    return `This action updates a #${id} example ${updateExampleDto}`;
  }

  remove(id: number) {
    return `This action removes a #${id} example`;
  }
}
