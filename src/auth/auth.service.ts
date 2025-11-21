/* eslint-disable @typescript-eslint/no-unused-vars */

/* eslint-disable @typescript-eslint/no-unsafe-member-access */

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { UsersService } from '../users/users.service';
import { JwtPayload, Secret, sign } from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  private getAccessSecret() {
    return process.env.JWT_ACCESS_TOKEN_SECRET ?? 'ACCESS_SECRET';
  }
  private getRefreshSecret() {
    return process.env.JWT_REFRESH_TOKEN_SECRET ?? 'REFRESH_SECRET';
  }
  private getAccessExpiry() {
    return process.env.JWT_ACCESS_EXPIRES_IN ?? '15m';
  }
  private getRefreshExpiry() {
    return process.env.JWT_REFRESH_EXPIRES_IN ?? '7d';
  }

  async register(dto: { name: string; email: string; password: string }) {
    const exists = await this.usersService.findByEmail(dto.email);
    if (exists) throw new BadRequestException('Email already registered');
    const user = await this.usersService.create(dto);
    return {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  }

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const pwMatches = await bcrypt.compare(password, user.password);
    if (!pwMatches) throw new UnauthorizedException('Invalid credentials');

    const tokens = this.getTokens(user._id.toString(), user.email, user.role);
    await this.usersService.setCurrentRefreshToken(
      user._id.toString(),
      tokens.refreshToken,
    );

    return tokens;
  }

  async logout(userId: string) {
    await this.usersService.removeRefreshToken(userId);
    return { message: 'Logged out' };
  }

  async refreshTokens(refreshToken: string) {
    try {
      const payload = jwt.verify(refreshToken, this.getRefreshSecret()) as any;
      const userId = payload.sub as string;
      if (!userId) throw new UnauthorizedException('Invalid token payload');

      const user = await this.usersService.getUserIfRefreshTokenMatches(
        refreshToken,
        userId,
      );
      if (!user) throw new UnauthorizedException('Refresh token invalid');

      const tokens = this.getTokens(user._id.toString(), user.email, user.role);
      await this.usersService.setCurrentRefreshToken(
        user._id.toString(),
        tokens.refreshToken,
      );
      return tokens;
    } catch (err) {
      throw new UnauthorizedException('Refresh token invalid');
    }
  }

  private getTokens(userId: string, email: string, role: string) {
    const payload: JwtPayload = { sub: userId, email, role };

    const accessToken = sign(payload, this.getAccessSecret() as Secret, {
      expiresIn: this.getAccessExpiry(),
    });

    const refreshToken = sign(
      { sub: userId } as JwtPayload,
      this.getRefreshSecret() as Secret,
      {
        expiresIn: this.getRefreshExpiry(),
      },
    );

    return { accessToken, refreshToken };
  }
}
