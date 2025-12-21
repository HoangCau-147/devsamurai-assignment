import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { Request } from 'express';
import type { SafeUser } from './users.service';

@Controller()
export class UsersController {
  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@Req() req: Request & { user: SafeUser }) {
    return req.user;
  }
}
