import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from '../user/user.module.js';

import { User } from '../user/entities/index.js';

import { IdentitiesService } from './identities.service.js';
import { IdentitiesController } from './identities.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([User]), UserModule],
  controllers: [IdentitiesController],
  providers: [IdentitiesService],
})
export class IdentitiesModule {}
