import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { ROLE_KEYS } from '@core/decorator';
import { ERole } from '@core/enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<ERole[]>(ROLE_KEYS, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    // [auth] step 4 check role
    return requiredRoles.some((role) => user.rol?.includes(role));
  }
}
