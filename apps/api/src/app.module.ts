import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { HealthModule } from './modules/health/health.module.js';
import { DatabaseModule } from './modules/database/database.module.js';

import { z } from 'zod';
import { UserModule } from './modules/user/user.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: z.object({
        NODE_ENV: z
          .enum(['development', 'production', 'test'])
          .default('development'),
        PORT: z.coerce.number().positive().default(3000),
        POSTGRES_PORT: z.coerce.number().positive().default(5432),
        POSTGRES_DB: z.string(),
        POSTGRES_USER: z.string(),
        POSTGRES_PASSWORD: z.string(),
        DB_HOST: z.string().default('localhost'),
        TEST_DATABASE_URL: z.string(),
        RUN_DATABASE_TESTS: z.coerce.boolean().default(false),
      }),
    }),
    HealthModule,
    DatabaseModule,
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
