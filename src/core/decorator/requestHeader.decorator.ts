import {
  createParamDecorator,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';

export const RequestHeader = createParamDecorator(
  async (value: never, ctx: ExecutionContext) => {
    const headers = ctx.switchToHttp().getRequest().headers;

    const dto: object = plainToInstance(value, headers, {
      excludeExtraneousValues: true,
    });

    const errors: ValidationError[] = await validate(dto);

    if (errors.length > 0) {
      const validationErrors = errors.map((obj) =>
        Object.values(obj.constraints),
      );
      throw new HttpException(
        `Validation failed with following Errors: ${validationErrors}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    return dto;
  },
);
