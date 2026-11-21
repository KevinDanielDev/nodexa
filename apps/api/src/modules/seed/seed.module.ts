import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from '../user/user.module.js';

import { User } from '../user/entities/user.entity.js';
import { SeedOperation } from './entities/seed-operation.entity.js';

import { SeedService } from './seed.service.js';
import { SeedController } from './seed.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([SeedOperation, User]), UserModule],
  controllers: [SeedController],
  providers: [SeedService],
})
export class SeedModule {}
