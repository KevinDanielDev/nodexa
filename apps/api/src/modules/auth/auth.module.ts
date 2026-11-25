import { Module } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { UserModule } from '../user/user.module.js';

@Module({
  controllers: [],
  providers: [AuthService],
  imports: [UserModule],
})
export class AuthModule {}
