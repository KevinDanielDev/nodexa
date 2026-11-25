import { Injectable, UnauthorizedException } from '@nestjs/common';

import { User } from '../user/entities/user.entity.js';

import { UserService } from '../user/user.service.js';

import { verifyPassword } from '../common/utils/verify-password.js';
import { normalizedEmail } from '../common/utils/normalized-email.js';

import { EUserStatus } from '../user/enums/user-status.enum.js';
import { TLoginResponse } from './types/login-response.type.js';

@Injectable()
export class AuthService {
  private readonly message = 'Invalid credentials, please try again';

  constructor(private readonly userService: UserService) {}

  public async login(email: string, password: string): Promise<TLoginResponse> {
    const user = await this.validateUserWithCredentials(email, password);

    const { status, deletedAt } = user;

    if (status !== EUserStatus.ACTIVE || deletedAt) {
      throw new UnauthorizedException(this.message);
    }

    // TODO: Implement JWT token generation and return it along with the user information

    const lastLoginAt = new Date();

    await this.userService.updateUserLastLogin(user.id, lastLoginAt);

    return {
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        displayName: user.displayName,
        avatarUrl: user.avatarUrl,
        status: user.status,
        lastLoginAt: lastLoginAt,
      },
    };
  }

  public async validateUserWithCredentials(
    email: string,
    password: string,
  ): Promise<User> {
    const normalizedUserEmail = normalizedEmail(email);

    const user = await this.userService.getUserByNormalizedEmail(
      normalizedUserEmail,
      {
        credential: true,
        identities: false,
        sessions: false,
      },
    );

    if (!user) throw new UnauthorizedException(this.message);

    const { credential } = user;

    if (!credential || !credential.passwordHash)
      throw new UnauthorizedException(this.message);

    const isPasswordValid = await verifyPassword(
      password,
      credential.passwordHash,
    );

    if (!isPasswordValid) throw new UnauthorizedException(this.message);

    return user;
  }
}
