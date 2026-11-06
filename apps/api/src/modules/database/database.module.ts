import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity.js';
import { UserCredential } from '../user/entities/user-credential.entity.js';
import { UserIdentity } from '../user/entities/user-identity.entity.js';
import { UserSession } from '../user/entities/user-session.entity.js';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        port: configService.get<number>('POSTGRES_PORT'),
        database: configService.get<string>('POSTGRES_DB'),
        username: configService.get<string>('POSTGRES_USER'),
        host: configService.get<string>('DB_HOST'),
        password: configService.get<string>('POSTGRES_PASSWORD'),
        autoLoadEntities: false,
        synchronize: false,
        connectTimeoutMS: 5000,
        retryAttempts: 5,
        retryDelay: 3000,
        migrationsRun: true,
        entities: [User, UserCredential, UserIdentity, UserSession],
      }),
    }),
  ],
  controllers: [],
  providers: [],
})
export class DatabaseModule {}
