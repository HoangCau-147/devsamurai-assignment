/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcrypt';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';

// Load .env if not in Docker
if (!process.env.DATABASE_URL) {
  dotenv.config();
}

let pool: Pool;

// Prioritize DATABASE_URL (Docker), fallback to individual vars (local)
if (process.env.DATABASE_URL) {
  console.log('🐳 Using DATABASE_URL from Docker environment');
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });
} else {
  console.log('💻 Using individual DB variables from .env');
  
  if (!process.env.DB_HOST || !process.env.DB_USER || !process.env.DB_PASSWORD || !process.env.DB_NAME) {
    throw new Error('Missing required database environment variables');
  }

  pool = new Pool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });
}

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Starting seed...');

  const admin = await prisma.user.upsert({
    where: { email: 'admin@devsamurai.com' },
    update: {},
    create: {
      name: 'Admin Samurai',
      email: 'admin@devsamurai.com',
      passwordHash: bcrypt.hashSync('password123', parseInt(process.env.SALT_ROUNDS || '10')),
    },
  });

  const user = await prisma.user.upsert({
    where: { email: 'user@devsamurai.com' },
    update: {},
    create: {
      name: 'Normal User',
      email: 'user@devsamurai.com',
      passwordHash: bcrypt.hashSync('password123456', parseInt(process.env.SALT_ROUNDS || '10')),
    },
  });

  console.log('✅ Seed completed successfully!');
  console.log('👤 Admin:', admin.email);
  console.log('👤 User:', user.email);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
