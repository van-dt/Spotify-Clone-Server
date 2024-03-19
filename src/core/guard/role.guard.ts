import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ERole } from '../enum';

export function RoleGuard(...requiredRoles: ERole[]) {
  return new JwtAuthGuard(...requiredRoles);
}

// Combine: Authentication => Authorization
@Injectable()
class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly requiredRoles: ERole[];
  constructor(...requiredRoles: ERole[]) {
    super();
    this.requiredRoles = requiredRoles;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 1. Authentication
    const isAuthenticated = (await super.canActivate(context)) as boolean;
    if (!isAuthenticated) return false;

    // 2. Authorization
    const httpRequest = context.switchToHttp().getRequest();
    const { user, path, method } = httpRequest;
    const isAuthorized = this.isAuthorized(user.role);
    if (!isAuthorized) {
      throw new UnauthorizedException(
        `${user.role} do not have permission for ${method} ${path}`,
      );
    } else {
      // Logging
      const controller = context.getClass().name;
      const handler = context.getHandler().name;
      console.info(`\nAUTHORIZED: ${user.email}`);
      console.info(`- ${method} ${path}`);
      console.info(`- ${controller} ${handler}`);
      console.info(`- req.params:`, httpRequest.params);
      console.info(`- req.query:`, httpRequest.query);
      console.info(`- req.body:`, httpRequest.body);
    }

    return isAuthorized;
  }

  private isAuthorized(userRole: ERole) {
    // pass if no role is required
    if (this.requiredRoles.length === 0) return true;

    // pass if user is super admin
    // if (userRole === ERole.SUPER_ADMIN) return true;

    // check user has any required role
    return this.requiredRoles.includes(userRole);
  }

  handleRequest(err, user, info) {
    if (err || !user) {
      console.error('handleRequest error:', err);
      console.info('handleRequest info:', info);
      throw err || new UnauthorizedException(info.message || err.message);
    }
    return user;
  }
}
