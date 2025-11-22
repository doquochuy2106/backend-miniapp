/* eslint-disable @typescript-eslint/no-unsafe-argument */
// src/auth/guards/global-auth.guard.ts
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import * as jwt from 'jsonwebtoken';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class GlobalAuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // check cả handler và class (method và controller)
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    const req = context.switchToHttp().getRequest();
    const authHeader =
      req.headers['authorization'] || req.headers['Authorization'];

    if (!authHeader) throw new UnauthorizedException('Missing Authorization');

    // support "Bearer <token>" or raw token
    const token =
      typeof authHeader === 'string' && authHeader.startsWith('Bearer ')
        ? authHeader.replace(/^Bearer\s+/i, '')
        : authHeader;

    try {
      const payload = jwt.verify(
        token,
        process.env.JWT_ACCESS_TOKEN_SECRET ?? 'ACCESS_SECRET',
      );

      // attach payload (user) to request
      req.user = payload;
      return true;
    } catch (e) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
