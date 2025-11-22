/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// src/auth/guards/roles.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 1. Lấy roles yêu cầu từ @Roles() gắn trên route hoặc class
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [
        context.getHandler(), // method
        context.getClass(), // controller
      ],
    );

    // 2. Nếu route không yêu cầu roles → ai cũng có thể vào (miễn là đã authenticated)
    if (!requiredRoles || requiredRoles.length === 0) return true;

    // 3. Lấy user từ req (đã được GlobalAuthGuard gán vào)
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) throw new ForbiddenException('Not authenticated');

    // 4. Kiểm tra user.role có nằm trong requiredRoles không
    if (!requiredRoles.includes(user.role)) {
      throw new ForbiddenException('You do not have permission');
    }

    return true;
  }
}
