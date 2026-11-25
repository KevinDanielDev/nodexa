import {
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';

import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import { passwordHash } from '../../../../src/modules/common/utils/password-hash.js';
import { AuthService } from '../../../../src/modules/auth/auth.service.js';
import { EUserStatus } from '../../../../src/modules/user/enums/user-status.enum.js';
import type { User } from '../../../../src/modules/user/entities/user.entity.js';

const email = 'person@gmail.com';
const password = 'password123';

const createUser = (overrides: Partial<User> = {}): User =>
  ({
    id: 'user-id',
    email,
    firstName: 'Ada',
    lastName: 'Lovelace',
    displayName: 'Ada Lovelace',
    avatarUrl: null,
    status: EUserStatus.ACTIVE,
    emailVerifiedAt: null,
    lastLoginAt: null,
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    updatedAt: new Date('2026-01-01T00:00:00.000Z'),
    deletedAt: null,
    credential: null,
    identities: [],
    sessions: [],
    ...overrides,
  }) as User;

describe('AuthService', () => {
  let service: AuthService;
  let userService: {
    getUserByNormalizedEmail: ReturnType<typeof vi.fn>;
    updateUserLastLogin: ReturnType<typeof vi.fn>;
  };
  let credentialHash: string;

  beforeAll(async () => {
    credentialHash = await passwordHash(password);
  });

  beforeEach(() => {
    userService = {
      getUserByNormalizedEmail: vi.fn(),
      updateUserLastLogin: vi.fn().mockResolvedValue(null),
    };
    service = new AuthService(userService as never);
  });

  it('authenticates an active local user and updates lastLoginAt', async () => {
    const user = createUser({
      credential: { passwordHash: credentialHash } as never,
    });
    userService.getUserByNormalizedEmail.mockResolvedValue(user);

    const result = await service.login('  PERSON@GMAIL.COM  ', password);

    expect(userService.getUserByNormalizedEmail).toHaveBeenCalledWith(
      email,
      { credential: true, identities: false, sessions: false },
    );
    expect(userService.updateUserLastLogin).toHaveBeenCalledWith(
      user.id,
      expect.any(Date),
    );
    expect(result).toEqual({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        displayName: user.displayName,
        avatarUrl: user.avatarUrl,
        status: user.status,
        lastLoginAt: expect.any(Date),
      },
    });
    expect(result.user).not.toHaveProperty('credential');
    expect(result.user).not.toHaveProperty('passwordHash');
    const updateCall = userService.updateUserLastLogin.mock.calls[0];
    expect(updateCall).toBeDefined();
    expect(result.user.lastLoginAt).toEqual(updateCall?.[1]);
  });

  it.each([
    ['an unknown user', null],
    ['a user without local credentials', createUser()],
  ])('rejects login for %s without revealing account state', async (_, user) => {
    userService.getUserByNormalizedEmail.mockResolvedValue(user);

    const error = service.login(email, password);

    await expect(error).rejects.toBeInstanceOf(UnauthorizedException);
    await expect(error).rejects.toThrow('Invalid credentials, please try again');
    expect(userService.updateUserLastLogin).not.toHaveBeenCalled();
  });

  it('rejects an incorrect password with the same generic error', async () => {
    userService.getUserByNormalizedEmail.mockResolvedValue(
      createUser({ credential: { passwordHash: credentialHash } as never }),
    );

    await expect(service.login(email, 'wrong-password')).rejects.toThrow(
      'Invalid credentials, please try again',
    );
    expect(userService.updateUserLastLogin).not.toHaveBeenCalled();
  });

  it('treats an invalid stored hash as invalid credentials', async () => {
    userService.getUserByNormalizedEmail.mockResolvedValue(
      createUser({ credential: { passwordHash: 'invalid-hash' } as never }),
    );

    await expect(service.login(email, password)).rejects.toThrow(
      'Invalid credentials, please try again',
    );
    expect(userService.updateUserLastLogin).not.toHaveBeenCalled();
  });

  it('rejects unsupported email domains before querying users', async () => {
    await expect(
      service.login('person@example.com', password),
    ).rejects.toBeInstanceOf(UnprocessableEntityException);
    expect(userService.getUserByNormalizedEmail).not.toHaveBeenCalled();
  });

  it.each([
    EUserStatus.SUSPENDED,
    EUserStatus.DISABLED,
  ])('rejects a %s user before updating lastLoginAt', async (status) => {
    userService.getUserByNormalizedEmail.mockResolvedValue(
      createUser({
        status,
        credential: { passwordHash: credentialHash } as never,
      }),
    );

    await expect(service.login(email, password)).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
    await expect(service.login(email, password)).rejects.toThrow(
      'Invalid credentials, please try again',
    );
    expect(userService.updateUserLastLogin).not.toHaveBeenCalled();
  });

  it('rejects a deleted user before updating lastLoginAt', async () => {
    userService.getUserByNormalizedEmail.mockResolvedValue(
      createUser({
        deletedAt: new Date('2026-01-02T00:00:00.000Z'),
        credential: { passwordHash: credentialHash } as never,
      }),
    );

    await expect(service.login(email, password)).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
    await expect(service.login(email, password)).rejects.toThrow(
      'Invalid credentials, please try again',
    );
    expect(userService.updateUserLastLogin).not.toHaveBeenCalled();
  });
});
