/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Body, Controller, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginUserDto } from '../users/dto/login-user.dto';
import { Public } from './decorators/public.decorator';
import { ResponseMessage } from 'src/auth/decorators/response-message.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('register')
  @ResponseMessage('Register success1')
  async register(@Body() dto: CreateUserDto) {
    return await this.authService.register(dto);
  }

  @Public()
  @Post('login')
  @ResponseMessage('Login success')
  async login(@Body() dto: LoginUserDto) {
    return await this.authService.login(dto.email, dto.password);
  }

  @Public()
  @Post('refresh')
  @ResponseMessage('Refresh success')
  async refresh(@Body('refreshToken') refreshToken: string) {
    return await this.authService.refreshTokens(refreshToken);
  }

  @Post('logout')
  @ResponseMessage('Logout success')
  async logout(@Req() req: any) {
    return await this.authService.logout(req.user.sub);
  }
}
