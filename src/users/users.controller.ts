/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Controller, Get, Req } from '@nestjs/common';
import { UsersService } from './users.service';
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('profile')
  async profile(@Req() req: any) {
    return await this.usersService.findById(req.user.sub);
  }
}
