import { ConflictException, NotFoundException } from '@nestjs/common';

import { beforeEach, describe, expect, it, vi } from 'vitest';

import { IdentitiesService } from '../../../../src/modules/identities/identities.service.js';
import { EIdentityProvider } from '../../../../src/modules/user/enums/identity-provider.enum.js';

const userId = 'user-id';
const provider = EIdentityProvider.GOOGLE;

const createDependencies = () => {
  const userService = {
    getUserByIdWithRelations: vi.fn(),
    getUserIdentityByProvider: vi.fn(),
    getUserIdentityByProviderSubject: vi.fn(),
    createUserIdentity: vi.fn(),
    removeUserIdentity: vi.fn(),
  };
  const service = new IdentitiesService(userService as never);

  return { service, userService };
};

describe('IdentitiesService', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('linkIdentity', () => {
    it('links a new identity', async () => {
      const { service, userService } = createDependencies();
      userService.getUserByIdWithRelations.mockResolvedValue({
        id: userId,
        identities: [],
      });
      userService.getUserIdentityByProvider.mockResolvedValue(null);
      userService.getUserIdentityByProviderSubject.mockResolvedValue(null);
      userService.createUserIdentity.mockResolvedValue({
        id: 'identity-id',
        userId,
        provider,
        providerSubject: 'subject',
      });

      await expect(
        service.linkIdentity({ userId, provider, providerSubject: 'subject' }),
      ).resolves.toEqual({
        message: 'Identity linked successfully',
        data: { userId, provider },
      });
      expect(userService.createUserIdentity).toHaveBeenCalledWith(
        userId,
        provider,
        'subject',
      );
      expect(userService.getUserIdentityByProvider).toHaveBeenCalledWith(
        userId,
        provider,
      );
      expect(
        userService.getUserIdentityByProviderSubject,
      ).toHaveBeenCalledWith(provider, 'subject');
    });

    it('rejects an unknown user', async () => {
      const { service, userService } = createDependencies();
      userService.getUserByIdWithRelations.mockResolvedValue(null);

      await expect(
        service.linkIdentity({ userId, provider, providerSubject: 'subject' }),
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it('rejects a second identity for the same provider', async () => {
      const { service, userService } = createDependencies();
      userService.getUserByIdWithRelations.mockResolvedValue({ identities: [] });
      userService.getUserIdentityByProvider.mockResolvedValue({
        provider,
        providerSubject: 'existing-subject',
      });

      await expect(
        service.linkIdentity({ userId, provider, providerSubject: 'new-subject' }),
      ).rejects.toThrow(
        new ConflictException('User already has an identity for this provider'),
      );
      expect(userService.createUserIdentity).not.toHaveBeenCalled();
      expect(
        userService.getUserIdentityByProviderSubject,
      ).not.toHaveBeenCalled();
    });

    it('rejects a provider subject already linked to another account', async () => {
      const { service, userService } = createDependencies();
      userService.getUserByIdWithRelations.mockResolvedValue({ identities: [] });
      userService.getUserIdentityByProvider.mockResolvedValue(null);
      userService.getUserIdentityByProviderSubject.mockResolvedValue({
        userId: 'another-user',
        provider,
        providerSubject: 'subject',
      });

      await expect(
        service.linkIdentity({ userId, provider, providerSubject: 'subject' }),
      ).rejects.toThrow(
        new ConflictException(
          'External identity is already linked to another user',
        ),
      );
      expect(userService.createUserIdentity).not.toHaveBeenCalled();
    });
  });

  describe('unlinkIdentity', () => {
    it('delegates unlinking of an existing identity', async () => {
      const { service, userService } = createDependencies();
      userService.getUserByIdWithRelations.mockResolvedValue({
        identities: [{ userId, provider }],
      });

      await expect(
        service.unlinkIdentity({ userId, provider }),
      ).resolves.toEqual({
        message: 'Identity unlinked successfully',
        data: { userId, provider },
      });
      expect(userService.removeUserIdentity).toHaveBeenCalledWith(
        userId,
        provider,
      );
    });

    it('rejects an unknown user', async () => {
      const { service, userService } = createDependencies();
      userService.getUserByIdWithRelations.mockResolvedValue(null);

      await expect(
        service.unlinkIdentity({ userId, provider }),
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it('rejects an identity not linked to the user', async () => {
      const { service, userService } = createDependencies();
      userService.getUserByIdWithRelations.mockResolvedValue({ identities: [] });

      await expect(
        service.unlinkIdentity({ userId, provider }),
      ).rejects.toBeInstanceOf(NotFoundException);
      expect(userService.removeUserIdentity).not.toHaveBeenCalled();
    });
  });
});
