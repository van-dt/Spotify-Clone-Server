import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { IsOptional, IsString } from 'class-validator';
import { Request } from 'express';

export class FindAllCategoryFilterDto {
  @IsString()
  @IsOptional()
  name?: string;
}

export const FindAllCategoryFilterParams = createParamDecorator(
  (_, ctx: ExecutionContext): FindAllCategoryFilterDto => {
    const req: Request = ctx.switchToHttp().getRequest();
    const filter: FindAllCategoryFilterDto = {};
    if (req.query.name) filter.name = req.query.name as string;
    return filter;
  },
);
