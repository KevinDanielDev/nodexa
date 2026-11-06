import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserService } from './user.service.js';
import { UserController } from './user.controller.js';
import {
  User,
  UserCredential,
  UserIdentity,
  UserSession,
} from './entities/index.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserCredential, UserIdentity, UserSession]),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
