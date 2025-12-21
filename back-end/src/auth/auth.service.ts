import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService, SafeUser } from '../users/users.service';
import { AuthSignupDto } from './dto/auth-signup.dto';

interface JwtRefreshPayload {
  sub: number;
  email: string;
  iat: number;
  exp: number;
}

@Injectable()
export class AuthService {
  constructor(
    private users: UsersService,
    private jwt: JwtService,
  ) {}

  async signup(
    dto: AuthSignupDto,
  ): Promise<{ user: SafeUser; accessToken: string; refreshToken: string }> {
    const user = await this.users.create(dto);
    const tokens = this.getTokens(user.id, user.email);
    return { user, ...tokens };
  }

  async login(
    email: string,
    password: string,
  ): Promise<{ user: SafeUser; accessToken: string; refreshToken: string }> {
    const user = await this.users.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const userWithHash = user;
    const valid = await bcrypt.compare(password, userWithHash.passwordHash);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    const { id, email: userEmail, name } = userWithHash;
    const tokens = this.getTokens(id, userEmail);
    const safeUser: SafeUser = { id, email: userEmail, name };
    return { user: safeUser, ...tokens };
  }

  getTokens(userId: number, email: string) {
    const accessToken = this.jwt.sign(
      { sub: userId, email },
      { expiresIn: '5m' },
    );
    const refreshToken = this.jwt.sign(
      { sub: userId, email },
      { expiresIn: '7d' },
    );
    return { accessToken, refreshToken };
  }

  async refresh(
    refreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      if (!refreshToken) throw new Error('No refresh token provided');

      const payload = this.jwt.verify<JwtRefreshPayload>(refreshToken);

      const user = await this.users.findById(payload.sub);

      if (!user) throw new Error('User not found');

      const tokens = this.getTokens(user.id, user.email);

      return tokens;
    } catch (err) {
      console.error(err);
      throw new Error('Invalid refresh token');
    }
  }
}
