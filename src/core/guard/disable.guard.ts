import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class DisableGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const disable = this.reflector.getAllAndOverride('disable', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!disable) return true;

    throw new HttpException('Not found', HttpStatus.NOT_FOUND);
  }
}
