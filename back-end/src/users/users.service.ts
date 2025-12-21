import { Injectable, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

export type FullUser = {
  id: number;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
};

export type SafeUser = Omit<
  FullUser,
  'passwordHash' | 'createdAt' | 'updatedAt'
>;

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}
  async create(createUserDto: CreateUserDto): Promise<SafeUser> {
    const { name, email, password } = createUserDto;

    const existing = await this.prisma.user.findUnique({ where: { email } });

    if (existing) throw new ConflictException('Email already in use');

    const saltRounds = Number.parseInt(process.env.SALT_ROUNDS ?? '10', 10);
    const rounds = Number.isNaN(saltRounds) ? 10 : saltRounds;

    const passwordHash = await bcrypt.hash(password, rounds);

    const user = await this.prisma.user.create({
      data: { name, email, passwordHash },
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash: _ph, ...result } = user;
    return result as SafeUser;
  }

  async findByEmail(email: string): Promise<FullUser | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findById(id: number): Promise<SafeUser | null> {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) return null;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash: _ph, ...result } = user as FullUser;

    return result as SafeUser;
  }
}
