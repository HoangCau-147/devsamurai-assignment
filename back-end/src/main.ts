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
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
