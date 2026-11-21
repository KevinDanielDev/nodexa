import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';

import { AppModule } from './app.module.js';

const logger = new Logger('Bootstrap');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Enable ConfigService
  const configService = app.get(ConfigService);

  // Port configuration
  const PORT = configService.get<number>('PORT', 3000);
  await app.listen(PORT);

  logger.log(`Server is running on http://localhost:${PORT}`);
}
await bootstrap();
