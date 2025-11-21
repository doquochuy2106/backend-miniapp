import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { GlobalAuthGuard } from './guards/global-auth.guard';
import { Reflector } from '@nestjs/core';

@Module({
  imports: [UsersModule],
  providers: [AuthService, GlobalAuthGuard, Reflector],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
