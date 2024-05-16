import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { IsOptional, IsString } from 'class-validator';
import { Request } from 'express';

export class FindAllPostFilterDto {
  @IsString()
  @IsOptional()
  title?: string;
}

export const FindAllPostFilterParams = createParamDecorator(
  (_, ctx: ExecutionContext): FindAllPostFilterDto => {
    const req: Request = ctx.switchToHttp().getRequest();
    const filter: FindAllPostFilterDto = {};
    if (req.query.title) filter.title = req.query.title as string;
    return filter;
  },
);
