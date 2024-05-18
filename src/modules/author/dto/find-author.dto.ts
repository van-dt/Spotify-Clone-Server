import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { IsOptional, IsString } from 'class-validator';
import { Request } from 'express';

export class FindAllAuthorFilterDto {
  @IsString()
  @IsOptional()
  name?: string;
}

export const FindAllAuthorFilterParams = createParamDecorator(
  (_, ctx: ExecutionContext): FindAllAuthorFilterDto => {
    const req: Request = ctx.switchToHttp().getRequest();
    const filter: FindAllAuthorFilterDto = {};
    if (req.query.name) filter.name = req.query.name as string;
    return filter;
  },
);
