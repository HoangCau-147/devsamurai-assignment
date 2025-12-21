import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );

  // Enable API versioning via env and set a global prefix like `api/v{version}`
  const API_VERSION = process.env.API_VERSION ?? '1';
  const apiPrefix = `api/v${API_VERSION}`;
  app.setGlobalPrefix(apiPrefix);
  console.log(`Global API prefix set to /${apiPrefix}`);

  // Enable CORS for the front-end dev server (and allow overriding via env)
  const FRONTEND_URL = process.env.FRONTEND_URL ?? 'http://localhost:5173';
  app.enableCors({
    origin: FRONTEND_URL,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true,
  });

  console.log(`CORS enabled for ${FRONTEND_URL}`);

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
