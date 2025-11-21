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

@Injectable()
export class GlobalAuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.get<boolean>(
      'isPublic',
      context.getHandler(),
    );

    if (isPublic) return true;

    const req = context.switchToHttp().getRequest();
    const authHeader = req.headers['authorization'];

    if (!authHeader) throw new UnauthorizedException('Missing Authorization');

    const token = authHeader.replace('Bearer ', '');

    try {
      const payload = jwt.verify(
        token,
        process.env.JWT_ACCESS_TOKEN_SECRET ?? 'ACCESS_SECRET',
      );

      req.user = payload;
      return true;
    } catch (e) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
