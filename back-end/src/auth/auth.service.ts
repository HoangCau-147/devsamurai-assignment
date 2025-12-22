import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
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
    try {
      const user = await this.users.create(dto);

      const tokens = this.getTokens(user.id, user.email);

      const safeUser: SafeUser = {
        id: user.id,
        email: user.email,
        name: user.name,
      };

      return { user: safeUser, ...tokens };
    } catch (error) {
      if (error.code === 'P2002' || error.message?.includes('Unique constraint')) {
        throw new BadRequestException('This email is already taken by another account.');
      }

      if (error instanceof BadRequestException || error.name === 'ValidationError') {
        throw error;
      }

      throw new BadRequestException('Registration failed. Please try again later.');
    }
  }

  async login(
    email: string,
    password: string,
  ): Promise<{ user: SafeUser; accessToken: string; refreshToken: string }> {
    const user = await this.users.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    const valid = await bcrypt.compare(password, user.passwordHash);

    if (!valid) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    const { id, email: userEmail, name } = user;
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
