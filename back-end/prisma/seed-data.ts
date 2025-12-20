/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcrypt';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

// Validate environment variables
if (
  !process.env.DB_HOST ||
  !process.env.DB_USER ||
  !process.env.DB_PASSWORD ||
  !process.env.DB_NAME
) {
  throw new Error('Missing required environment variables');
}

const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.user.upsert({
    where: { email: 'admin@devsamurai.com' },
    update: {},
    create: {
      name: 'Admin Samurai',
      email: 'admin@devsamurai.com',
      passwordHash: bcrypt.hashSync(
        'password123',
        parseInt(process.env.SALT_ROUNDS || '10'),
      ),
    },
  });

  await prisma.user.upsert({
    where: { email: 'user@devsamurai.com' },
    update: {},
    create: {
      name: 'Normal User',
      email: 'user@devsamurai.com',
      passwordHash: bcrypt.hashSync(
        'password123456',
        parseInt(process.env.SALT_ROUNDS || '10'),
      ),
    },
  });

  console.log('Seed data successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
