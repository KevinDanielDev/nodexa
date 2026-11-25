import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';

import { beforeEach, describe, expect, it, vi } from 'vitest';

import { EIdentityProvider } from '../../../../src/modules/user/enums/identity-provider.enum.js';
import { UserService } from '../../../../src/modules/user/user.service.js';

const userData = {
  email: 'person@gmail.com',
  firstName: 'Ada',
  lastName: 'Lovelace',
};

const createDependencies = () => {
  const userRepository = {
    findOne: vi.fn(),
    findOneBy: vi.fn(),
    merge: vi.fn((target, data) => Object.assign(target, data)),
    save: vi.fn(),
  };
  const userIdentityRepository = {
    create: vi.fn((value) => value),
    save: vi.fn(async (value) => value),
    findOne: vi.fn(),
    findOneBy: vi.fn(),
    count: vi.fn(),
    remove: vi.fn(),
  };
  const userCredentialRepository = {
    count: vi.fn(),
  };
  const manager = {
    create: vi.fn((_, value) => ({ id: 'new-id', ...value })),
    save: vi.fn(async (value) => ({ id: 'new-id', ...value })),
  };
  const dataSource = {
    transaction: vi.fn(async (callback) => callback(manager)),
  };

  const service = new UserService(
    userRepository as never,
    dataSource as never,
    userIdentityRepository as never,
    userCredentialRepository as never,
  );

  return {
    service,
    userRepository,
    userIdentityRepository,
    userCredentialRepository,
    dataSource,
    manager,
  };
};

describe('UserService', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('createUser', () => {
    it('creates a local user with credentials', async () => {
      const { service, manager } = createDependencies();
      vi.spyOn(service, 'getUserByNormalizedEmail').mockResolvedValue(null);

      const result = await service.createUser({
        user: userData,
        credential: { password: 'password123' },
      });

      expect(result.message).toBe('User created successfully');
      expect(manager.create).toHaveBeenCalledTimes(2);
      expect(manager.create).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          userId: 'new-id',
          passwordHash: expect.stringContaining('$argon2'),
        }),
      );
    });

    it('creates an external user with an identity and no credentials', async () => {
      const { service, manager } = createDependencies();
      vi.spyOn(service, 'getUserByNormalizedEmail').mockResolvedValue(null);

      await service.createUser({
        user: userData,
        identities: [
          {
            provider: EIdentityProvider.GOOGLE,
            providerSubject: 'google-subject',
          },
        ],
      });

      expect(manager.create).toHaveBeenCalledTimes(2);
      expect(manager.create).toHaveBeenLastCalledWith(
        expect.anything(),
        expect.objectContaining({
          provider: EIdentityProvider.GOOGLE,
          providerSubject: 'google-subject',
          userId: 'new-id',
        }),
      );
    });

    it('creates a user with both authentication methods', async () => {
      const { service, manager } = createDependencies();
      vi.spyOn(service, 'getUserByNormalizedEmail').mockResolvedValue(null);

      await service.createUser({
        user: userData,
        credential: { password: 'password123' },
        identities: [
          {
            provider: EIdentityProvider.GOOGLE,
            providerSubject: 'google-subject',
          },
        ],
      });

      expect(manager.create).toHaveBeenCalledTimes(3);
    });

    it.each([
      ['without credential or identity', {}],
      ['with an empty identity list', { identities: [] }],
      ['with an empty credential', { credential: {} }],
      ['with a null password', { credential: { password: null } }],
    ])('rejects creation %s', async (_, authentication) => {
      const { service, dataSource } = createDependencies();

      await expect(
        service.createUser({ user: userData, ...authentication }),
      ).rejects.toBeInstanceOf(BadRequestException);
      expect(dataSource.transaction).not.toHaveBeenCalled();
    });

    it('rejects an existing email before opening a transaction', async () => {
      const { service, dataSource } = createDependencies();
      vi.spyOn(service, 'getUserByNormalizedEmail').mockResolvedValue({
        id: 'existing-id',
      } as never);

      await expect(
        service.createUser({
          user: userData,
          credential: { password: 'password123' },
        }),
      ).rejects.toBeInstanceOf(ConflictException);
      expect(dataSource.transaction).not.toHaveBeenCalled();
    });

    it('propagates a persistence failure so the transaction can roll back', async () => {
      const { service, manager, dataSource } = createDependencies();
      vi.spyOn(service, 'getUserByNormalizedEmail').mockResolvedValue(null);
      let saveCount = 0;
      manager.save.mockImplementation(async (value) => {
        saveCount += 1;
        if (saveCount === 2) throw new Error('credential insert failed');
        return { id: 'new-id', ...value };
      });

      await expect(
        service.createUser({
          user: userData,
          credential: { password: 'password123' },
        }),
      ).rejects.toThrow('credential insert failed');
      expect(dataSource.transaction).toHaveBeenCalledTimes(1);
    });
  });

  describe('removeUserIdentity', () => {
    it('allows removing an identity when credentials exist', async () => {
      const { service, userIdentityRepository, userCredentialRepository } =
        createDependencies();
      const identity = { userId: 'user-id', provider: EIdentityProvider.GOOGLE };
      userIdentityRepository.findOne.mockResolvedValue(identity);
      userCredentialRepository.count.mockResolvedValue(1);
      userIdentityRepository.count.mockResolvedValue(1);

      await expect(
        service.removeUserIdentity('user-id', EIdentityProvider.GOOGLE),
      ).resolves.toBeUndefined();
      expect(userIdentityRepository.remove).toHaveBeenCalledWith(identity);
    });

    it('allows removing one of several identities without credentials', async () => {
      const { service, userIdentityRepository, userCredentialRepository } =
        createDependencies();
      const identity = { userId: 'user-id', provider: EIdentityProvider.GOOGLE };
      userIdentityRepository.findOne.mockResolvedValue(identity);
      userCredentialRepository.count.mockResolvedValue(0);
      userIdentityRepository.count.mockResolvedValue(2);

      await expect(
        service.removeUserIdentity('user-id', EIdentityProvider.GOOGLE),
      ).resolves.toBeUndefined();
    });

    it('rejects removing the last identity without credentials', async () => {
      const { service, userIdentityRepository, userCredentialRepository } =
        createDependencies();
      userIdentityRepository.findOne.mockResolvedValue({
        userId: 'user-id',
        provider: EIdentityProvider.GOOGLE,
      });
      userCredentialRepository.count.mockResolvedValue(0);
      userIdentityRepository.count.mockResolvedValue(1);

      await expect(
        service.removeUserIdentity('user-id', EIdentityProvider.GOOGLE),
      ).rejects.toThrow(
        new BadRequestException(
          'Cannot unlink identity. User must retain an authentication method.',
        ),
      );
      expect(userIdentityRepository.remove).not.toHaveBeenCalled();
    });

    it('rejects removing an identity that is not linked', async () => {
      const { service, userIdentityRepository } = createDependencies();
      userIdentityRepository.findOne.mockResolvedValue(null);

      await expect(
        service.removeUserIdentity('user-id', EIdentityProvider.GOOGLE),
      ).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe('user relation loading', () => {
    it('loads all relations by default for an existing user', async () => {
      const { service, userRepository } = createDependencies();
      userRepository.findOne.mockResolvedValue({ id: 'user-id' });

      await expect(service.getUserByIdWithRelations('user-id')).resolves.toEqual(
        { id: 'user-id' },
      );

      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'user-id' },
        relations: {
          credential: true,
          identities: true,
          sessions: true,
        },
      });
    });

    it('loads only requested relations for normalized email lookups', async () => {
      const { service, userRepository } = createDependencies();
      userRepository.findOne.mockResolvedValue({ id: 'user-id' });

      await service.getUserByNormalizedEmail('person@gmail.com', {
        credential: true,
        identities: false,
        sessions: false,
      });

      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { normalizedEmail: 'person@gmail.com' },
        relations: {
          credential: true,
          identities: false,
          sessions: false,
        },
      });
    });

    it('updates lastLoginAt without loading any relation', async () => {
      const { service, userRepository } = createDependencies();
      const user = { id: 'user-id', lastLoginAt: null };
      const lastLoginAt = new Date('2026-01-02T00:00:00.000Z');
      userRepository.findOne.mockResolvedValue(user);
      userRepository.save.mockResolvedValue({ ...user, lastLoginAt });

      await expect(
        service.updateUserLastLogin(user.id, lastLoginAt),
      ).resolves.toEqual({ ...user, lastLoginAt });

      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { id: user.id },
        relations: {
          credential: false,
          identities: false,
          sessions: false,
        },
      });
      expect(userRepository.save).toHaveBeenCalledWith({
        ...user,
        lastLoginAt,
      });
    });

    it('does not save lastLoginAt when the user no longer exists', async () => {
      const { service, userRepository } = createDependencies();
      userRepository.findOne.mockResolvedValue(null);

      await expect(
        service.updateUserLastLogin(
          'missing-user',
          new Date('2026-01-02T00:00:00.000Z'),
        ),
      ).resolves.toBeNull();
      expect(userRepository.save).not.toHaveBeenCalled();
    });
  });
});
