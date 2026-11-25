import { InjectRepository } from '@nestjs/typeorm';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { DataSource, Repository } from 'typeorm';

import { CreateUserDto } from './dto/create-user.dto.js';

import { User } from './entities/user.entity.js';
import { UserIdentity } from './entities/user-identity.entity.js';
import { UserCredential } from './entities/user-credential.entity.js';

import { passwordHash } from '../common/utils/password-hash.js';
import { normalizedEmail } from '../common/utils/normalized-email.js';
import { EIdentityProvider } from './enums/identity-provider.enum.js';
import { TCreateUserResponse } from './types/create-user-response.type.js';
import { TUserRelationsOptions } from './types/user-relations-options.type.js';

@Injectable()
export class UserService {
  private readonly safeCredential: boolean = true;
  private readonly safeIdentities: boolean = true;
  private readonly safeSessions: boolean = true;

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly dataSource: DataSource,
    @InjectRepository(UserIdentity)
    private readonly userIdentityRepository: Repository<UserIdentity>,
    @InjectRepository(UserCredential)
    private readonly userCredentialRepository: Repository<UserCredential>,
  ) {}

  public async createUser(
    createUserDto: CreateUserDto,
  ): Promise<TCreateUserResponse> {
    const { user, credential, identities } = createUserDto;

    const hasCredential = Boolean(credential?.password);
    const hasIdentity = Boolean(identities?.length);

    if (!user || (!hasCredential && !hasIdentity))
      throw new BadRequestException(
        'User data and at least one authentication method are required',
      );

    const existingUser = await this.getUserByNormalizedEmail(
      normalizedEmail(user.email),
    );

    if (existingUser)
      throw new ConflictException('User with this email already exists');

    // Transactional operation to create user, credential, and identities
    return await this.dataSource.transaction(async (manager) => {
      // Create the user
      const normalizedUserEmail = normalizedEmail(user.email);
      const newUser = manager.create(User, {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        displayName: user.displayName,
        avatarUrl: user.avatarUrl,
        status: user.status,
        normalizedEmail: normalizedUserEmail,
      });
      newUser.normalizedEmail = normalizedUserEmail;
      await manager.save(newUser);

      // Create the credential
      if (credential && credential.password) {
        const hash = await passwordHash(credential.password);
        const newCredential = manager.create(UserCredential, {
          passwordHash: hash,
          userId: newUser.id,
        });
        await manager.save(newCredential);
      }

      // Create the identities
      if (identities && identities.length > 0) {
        for (const identity of identities) {
          const newIdentity = manager.create(UserIdentity, {
            provider: identity.provider,
            providerSubject: identity.providerSubject,
            userId: newUser.id,
          });
          await manager.save(newIdentity);
        }
      }

      // @ts-ignore
      const { id: _id, email: _email, ...rest } = newUser;

      return {
        message: 'User created successfully',
        user: rest,
      };
    });
  }

  public async createUserIdentity(
    userId: string,
    provider: EIdentityProvider,
    providerSubject: string,
  ): Promise<UserIdentity> {
    const newIdentity = this.userIdentityRepository.create({
      userId,
      provider,
      providerSubject,
    });
    await this.userIdentityRepository.save(newIdentity);
    return newIdentity;
  }

  public async getUserIdentityByProvider(
    userId: string,
    provider: EIdentityProvider,
  ): Promise<UserIdentity | null> {
    return this.userIdentityRepository.findOneBy({ userId, provider });
  }

  public async getUserIdentityByProviderSubject(
    provider: EIdentityProvider,
    providerSubject: string,
  ): Promise<UserIdentity | null> {
    return this.userIdentityRepository.findOneBy({
      provider,
      providerSubject,
    });
  }

  public async removeUserIdentity(
    userId: string,
    provider: EIdentityProvider,
  ): Promise<void> {
    const identityToRemove = await this.userIdentityRepository.findOne({
      where: { userId, provider },
    });

    if (!identityToRemove)
      throw new NotFoundException('Identity not found for the user');

    const [credentialCount, identityCount] = await Promise.all([
      this.userCredentialRepository.count({
        where: { userId },
      }),
      this.userIdentityRepository.count({
        where: { userId },
      }),
    ]);

    if (credentialCount === 0 && identityCount <= 1)
      throw new BadRequestException(
        'Cannot unlink identity. User must retain an authentication method.',
      );

    await this.userIdentityRepository.remove(identityToRemove);
  }

  public async getUserByNormalizedEmail(
    normalizedEmail: string,
    {
      credential: safeCredential = this.safeCredential,
      identities: safeIdentities = this.safeIdentities,
      sessions: safeSessions = this.safeSessions,
    }: TUserRelationsOptions = {},
  ): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { normalizedEmail },
      relations: {
        credential: safeCredential,
        identities: safeIdentities,
        sessions: safeSessions,
      },
    });
    if (!user) return null;
    return user;
  }

  public async updateUserLastLogin(
    userId: string,
    lastLoginAt: Date,
  ): Promise<User | null> {
    const user = await this.getUserByIdWithRelations(userId, {
      credential: false,
      identities: false,
      sessions: false,
    });
    if (!user) return null;

    this.userRepository.merge(user, { lastLoginAt });

    return this.userRepository.save(user);
  }

  public async getUserByIdWithRelations(
    id: string,
    {
      credential: safeCredential = this.safeCredential,
      identities: safeIdentities = this.safeIdentities,
      sessions: safeSessions = this.safeSessions,
    }: TUserRelationsOptions = {},
  ): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: {
        credential: safeCredential,
        identities: safeIdentities,
        sessions: safeSessions,
      },
    });

    if (!user) return null;
    return user;
  }
}
