/* eslint-disable @typescript-eslint/ban-types */
import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class ValidationPipe implements PipeTransform<unknown> {
  async transform(value: unknown, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToInstance(metatype, value);
    const errors = await validate(object);
    if (errors.length > 0) {
      const objectError = errors.map((error) => {
        return {
          property: error[`property`],
          constraints: error[`constraints`],
        };
      });
      // eslint-disable-next-line no-console
      console.trace(errors);
      throw new BadRequestException(objectError);
    }
    return value;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
