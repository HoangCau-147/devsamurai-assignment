import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthSignupDto } from './dto/auth-signup.dto';
import { AuthLoginDto } from './dto/auth-login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import type { Request } from 'express';
import type { SafeUser } from '../users/users.service';

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post('signup')
  async signup(@Body() dto: AuthSignupDto) {
    return this.auth.signup(dto);
  }

  @Post('login')
  async login(@Body() dto: AuthLoginDto) {
    return this.auth.login(dto.email, dto.password);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@Req() req: Request & { user: SafeUser }) {
    // JwtStrategy already returns SafeUser
    return req.user;
  }

  @Post('refresh')
  async refresh(@Body('refreshToken') refreshToken: string) {
    return this.auth.refresh(refreshToken);
  }
}
