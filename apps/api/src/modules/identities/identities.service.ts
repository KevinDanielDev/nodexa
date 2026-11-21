import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { UserService } from '../user/user.service.js';

import { LinkIdentityDto } from './dto/link-identity.dto.js';
import { UnlinkIdentityDto } from './dto/unlink-identity.dto.js';

import { TLinkIdentityResponse } from './types/link-identity-response.type.js';
import { TUnlinkIdentityResponse } from './types/unlink-identity-response.type.js';

@Injectable()
export class IdentitiesService {
  constructor(private readonly userService: UserService) {}

  public async linkIdentity(
    linkIdentityDto: LinkIdentityDto,
  ): Promise<TLinkIdentityResponse> {
    const { userId, provider, providerSubject } = linkIdentityDto;

    const user = await this.userService.getUserByIdWithRelations(userId);

    if (!user) throw new NotFoundException('User not found');

    const existingProviderIdentity =
      await this.userService.getUserIdentityByProvider(userId, provider);

    if (existingProviderIdentity)
      throw new ConflictException(
        'User already has an identity for this provider',
      );

    const existingExternalIdentity =
      await this.userService.getUserIdentityByProviderSubject(
        provider,
        providerSubject,
      );

    if (existingExternalIdentity)
      throw new ConflictException(
        'External identity is already linked to another user',
      );

    // Link the new identity to the user
    const newIdentity = await this.userService.createUserIdentity(
      userId,
      provider,
      providerSubject,
    );

    const { id: _id, ...rest } = newIdentity;

    return {
      message: 'Identity linked successfully',
      data: {
        userId: rest.userId,
        provider: rest.provider,
      },
    };
  }

  public async unlinkIdentity(
    unlinkIdentityDto: UnlinkIdentityDto,
  ): Promise<TUnlinkIdentityResponse> {
    const { userId, provider } = unlinkIdentityDto;

    const user = await this.userService.getUserByIdWithRelations(userId);

    if (!user) throw new NotFoundException('User not found');

    const identityToRemove = user.identities.find(
      (identity) => identity.provider === provider,
    );

    if (!identityToRemove)
      throw new NotFoundException('Identity not found for the user');

    await this.userService.removeUserIdentity(
      identityToRemove.userId,
      identityToRemove.provider,
    );
    return {
      message: 'Identity unlinked successfully',
      data: {
        userId,
        provider,
      },
    };
  }
}

