import {
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

import { IS_PUBLIC_KEY } from '@core/decorator';
import { ErrorMessage } from '@core/enum';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    // [Auth] step 1: check if endpoint needs auth?
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = request.headers['authorization'];

    if (!token) return true;

    return super.canActivate(context);
  }

  handleRequest(err, user, info: Error) {
    // [Auth] step 3: after decode token
    // can you check user expire plan purchase in here or expire token
    if (info?.name === 'TokenExpireError')
      throw new HttpException(
        ErrorMessage.TOKEN_EXPIRED,
        HttpStatus.UNAUTHORIZED,
      );

    // You can throw an exception based on either "info" or "err" arguments
    if (err || !user) {
      throw err || new UnauthorizedException();
    }

    return user;
  }
}
