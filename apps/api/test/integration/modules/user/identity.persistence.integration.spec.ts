import { createHash, randomUUID } from 'node:crypto';

import { DataSource } from 'typeorm';
import { beforeAll, describe, expect, it } from 'vitest';

import { normalizedEmail } from '../../../../src/modules/common/utils/normalizedEmail.js';
import { IdentitiesService } from '../../../../src/modules/identities/identities.service.js';
import { InitialIdentity1793989414762 } from '../../../../src/modules/database/migrations/1793989414762-InitialIdentity.js';
import { SeedOperations1794415254760 } from '../../../../src/modules/database/migrations/1794415254760-SeedOperations.js';
import { SeedOperation } from '../../../../src/modules/seed/entities/seed-operation.entity.js';
import { ESeedStatus } from '../../../../src/modules/seed/enums/seed-status.enum.js';
import { SeedService } from '../../../../src/modules/seed/seed.service.js';
import { usersSeed } from '../../../../src/modules/seed/data/users.seed.js';
import {
  User,
  UserCredential,
  UserIdentity,
  UserSession,
} from '../../../../src/modules/user/entities/index.js';
import { EIdentityProvider, EUserStatus } from '../../../../src/modules/user/enums/index.js';
import { UserService } from '../../../../src/modules/user/user.service.js';

const databaseUrl = process.env.TEST_DATABASE_URL;
const runDatabaseTests = process.env.RUN_DATABASE_TESTS === 'true' && databaseUrl;

if (process.env.REQUIRE_DATABASE_TESTS === 'true' && !runDatabaseTests)
  throw new Error(
    'PostgreSQL integration tests require RUN_DATABASE_TESTS=true and TEST_DATABASE_URL.',
  );

const dataSource = runDatabaseTests
  ? new DataSource({
      type: 'postgres',
      url: databaseUrl,
      entities: [User, UserCredential, UserIdentity, UserSession, SeedOperation],
      migrations: [InitialIdentity1793989414762, SeedOperations1794415254760],
      synchronize: false,
    })
  : undefined;

let userService: UserService;
let identitiesService: IdentitiesService;
let seedService: SeedService;

const createUser = (email = `${randomUUID()}@gmail.com`): User => {
  const user = new User();
  user.email = email;
  user.firstName = 'Test';
  user.lastName = 'User';
  user.status = EUserStatus.ACTIVE;
  return user;
};

const usersSeedKey = (): string => {
  const normalizedUsers = usersSeed
    .map((seed) => ({
      user: { ...seed.user, email: normalizedEmail(seed.user.email) },
      credential: seed.credential ? { ...seed.credential } : null,
      identities: seed.identities
        .map((identity) => ({ ...identity }))
        .sort((a, b) => a.providerSubject.localeCompare(b.providerSubject)),
    }))
    .sort((a, b) => a.user.email.localeCompare(b.user.email));

  return `users_seed:${createHash('sha256')
    .update(JSON.stringify(normalizedUsers))
    .digest('hex')}`;
};

describe.skipIf(!runDatabaseTests)('Identity persistence with PostgreSQL', () => {
  it('enforces normalized email uniqueness', async () => {
    const repository = dataSource!.getRepository(User);
    const firstUser = await repository.save(createUser('same@gmail.com'));

    await expect(repository.save(createUser('SAME@gmail.com'))).rejects.toThrow();

    await repository.delete(firstUser.id);
  });

  it('allows multiple sessions while keeping token hashes unique', async () => {
    const userRepository = dataSource!.getRepository(User);
    const sessionRepository = dataSource!.getRepository(UserSession);
    const user = await userRepository.save(createUser());

    await sessionRepository.save([
      {
        userId: user.id,
        tokenHash: `${randomUUID()}-one`,
        expiresAt: new Date(Date.now() + 60_000),
      },
      {
        userId: user.id,
        tokenHash: `${randomUUID()}-two`,
        expiresAt: new Date(Date.now() + 60_000),
      },
    ]);

    expect(await sessionRepository.countBy({ userId: user.id })).toBe(2);
    await expect(
      sessionRepository.save({
        userId: user.id,
        tokenHash: 'duplicate-token-hash',
        expiresAt: new Date(Date.now() + 60_000),
      }),
    ).resolves.toBeDefined();
    await expect(
      sessionRepository.save({
        userId: user.id,
        tokenHash: 'duplicate-token-hash',
        expiresAt: new Date(Date.now() + 60_000),
      }),
    ).rejects.toThrow();
  });

  it('enforces one identity per provider and globally unique provider subjects', async () => {
    const userRepository = dataSource!.getRepository(User);
    const identityRepository = dataSource!.getRepository(UserIdentity);
    const firstUser = await userRepository.save(createUser());
    const secondUser = await userRepository.save(createUser());

    await identityRepository.save({
      userId: firstUser.id,
      provider: EIdentityProvider.GOOGLE,
      providerSubject: 'google-subject',
    });

    await expect(
      identityRepository.save({
        userId: firstUser.id,
        provider: EIdentityProvider.GOOGLE,
        providerSubject: 'another-subject',
      }),
    ).rejects.toThrow();

    await expect(
      identityRepository.save({
        userId: secondUser.id,
        provider: EIdentityProvider.GOOGLE,
        providerSubject: 'google-subject',
      }),
    ).rejects.toThrow();
  });

  it('supports local and external authentication independently', async () => {
    const userRepository = dataSource!.getRepository(User);
    const credentialRepository = dataSource!.getRepository(UserCredential);
    const identityRepository = dataSource!.getRepository(UserIdentity);

    const localUser = await userService.createUser({
      user: {
        email: `${randomUUID()}@gmail.com`,
        firstName: 'Local',
        lastName: 'User',
      },
      credential: { password: 'password123' },
    });
    const externalUser = await userService.createUser({
      user: {
        email: `${randomUUID()}@gmail.com`,
        firstName: 'External',
        lastName: 'User',
      },
      identities: [
        {
          provider: EIdentityProvider.GOOGLE,
          providerSubject: randomUUID(),
        },
      ],
    });

    expect(await userRepository.count()).toBe(2);
    expect(await credentialRepository.count()).toBe(1);
    expect(await identityRepository.count()).toBe(1);
    expect(localUser.user).not.toHaveProperty('email');
    expect(externalUser.user).not.toHaveProperty('email');
  });

  it('rejects linking a provider already used by the same user', async () => {
    const user = await userRepositoryForTest().save(createUser());
    await userIdentityRepositoryForTest().save({
      userId: user.id,
      provider: EIdentityProvider.GOOGLE,
      providerSubject: 'existing-subject',
    });

    await expect(
      identitiesService.linkIdentity({
        userId: user.id,
        provider: EIdentityProvider.GOOGLE,
        providerSubject: 'another-subject',
      }),
    ).rejects.toThrow('User already has an identity for this provider');
  });

  it('rejects linking a provider subject already used by another user', async () => {
    const firstUser = await userRepositoryForTest().save(createUser());
    const secondUser = await userRepositoryForTest().save(createUser());
    await userIdentityRepositoryForTest().save({
      userId: firstUser.id,
      provider: EIdentityProvider.GOOGLE,
      providerSubject: 'already-used-subject',
    });

    await expect(
      identitiesService.linkIdentity({
        userId: secondUser.id,
        provider: EIdentityProvider.GOOGLE,
        providerSubject: 'already-used-subject',
      }),
    ).rejects.toThrow(
      'External identity is already linked to another user',
    );
  });

  it('allows unlinking an identity while a credential remains', async () => {
    const email = `${randomUUID()}@gmail.com`;
    await userService.createUser({
      user: {
        email,
        firstName: 'Linked',
        lastName: 'User',
      },
      credential: { password: 'password123' },
    });
    const persistedUser = await userRepositoryForTest().findOneBy({
      normalizedEmail: email,
    });
    expect(persistedUser).not.toBeNull();

    await identitiesService.linkIdentity({
      userId: persistedUser!.id,
      provider: EIdentityProvider.GOOGLE,
      providerSubject: randomUUID(),
    });

    await expect(
      identitiesService.unlinkIdentity({
        userId: persistedUser!.id,
        provider: EIdentityProvider.GOOGLE,
      }),
    ).resolves.toMatchObject({ message: 'Identity unlinked successfully' });
    expect(await userIdentityRepositoryForTest().count()).toBe(0);
  });

  it('rejects unlinking the only identity when no credential exists', async () => {
    const email = `${randomUUID()}@gmail.com`;
    await userService.createUser({
      user: { email, firstName: 'External', lastName: 'User' },
      identities: [
        {
          provider: EIdentityProvider.GOOGLE,
          providerSubject: randomUUID(),
        },
      ],
    });
    const user = await userRepositoryForTest().findOneBy({
      normalizedEmail: email,
    });
    expect(user).not.toBeNull();

    await expect(
      identitiesService.unlinkIdentity({
        userId: user!.id,
        provider: EIdentityProvider.GOOGLE,
      }),
    ).rejects.toThrow(
      'Cannot unlink identity. User must retain an authentication method.',
    );
    expect(await userIdentityRepositoryForTest().count()).toBe(1);
  });

  it('cascades credentials and identities when deleting a user', async () => {
    const user = await userRepositoryForTest().save(createUser());
    await userCredentialRepositoryForTest().save({
      userId: user.id,
      passwordHash: 'hash',
    });
    await userIdentityRepositoryForTest().save({
      userId: user.id,
      provider: EIdentityProvider.GOOGLE,
      providerSubject: randomUUID(),
    });

    await userRepositoryForTest().remove(user);

    expect(await userCredentialRepositoryForTest().count()).toBe(0);
    expect(await userIdentityRepositoryForTest().count()).toBe(0);
  });

  it('runs the complete user seed and makes the second run idempotent', async () => {
    const seedOperationRepository = dataSource!.getRepository(SeedOperation);
    const firstResult = await seedService.insertUsers({
      url: '/seed/users',
    } as Request);

    expect(firstResult).toBe('Users seeded successfully.');
    expect(await userRepositoryForTest().count()).toBe(usersSeed.length);
    expect(await userCredentialRepositoryForTest().count()).toBe(
      usersSeed.filter((seed) => seed.credential).length,
    );
    expect(await userIdentityRepositoryForTest().count()).toBe(
      usersSeed.reduce((count, seed) => count + seed.identities.length, 0),
    );

    const operation = await seedOperationRepository.findOneBy({
      resource: '/seed/users',
    });
    expect(operation?.status).toBe('COMPLETED');
    expect(operation?.metadata).toMatchObject({
      usersCount: usersSeed.length,
    });

    await expect(
      seedService.insertUsers({ url: '/seed/users' } as Request),
    ).resolves.toBe('Users have already been seeded.');
    expect(await userRepositoryForTest().count()).toBe(usersSeed.length);
  });

  it('keeps concurrent seed requests idempotent', async () => {
    const results = await Promise.all([
      seedService.insertUsers({ url: '/seed/users' } as Request),
      seedService.insertUsers({ url: '/seed/users' } as Request),
    ]);

    expect(results.sort()).toEqual([
      'Users have already been seeded.',
      'Users seeded successfully.',
    ]);
    expect(await userRepositoryForTest().count()).toBe(usersSeed.length);
    expect(await seedOperationRepositoryForTest().count()).toBe(1);
  });

  it('retries a previously failed seed operation', async () => {
    await seedOperationRepositoryForTest().save({
      key: usersSeedKey(),
      resource: '/seed/users',
      status: ESeedStatus.FAILED,
      metadata: { error: 'previous failure' },
    });

    await expect(
      seedService.insertUsers({ url: '/seed/users' } as Request),
    ).resolves.toBe('Users seeded successfully.');

    const operation = await seedOperationRepositoryForTest().findOneBy({
      key: usersSeedKey(),
    });
    expect(operation?.status).toBe(ESeedStatus.COMPLETED);
    expect(await userRepositoryForTest().count()).toBe(usersSeed.length);
  });
});

const userRepositoryForTest = () => dataSource!.getRepository(User);
const userIdentityRepositoryForTest = () => dataSource!.getRepository(UserIdentity);
const userCredentialRepositoryForTest = () =>
  dataSource!.getRepository(UserCredential);
const seedOperationRepositoryForTest = () =>
  dataSource!.getRepository(SeedOperation);

const clearDatabase = async (): Promise<void> => {
  await dataSource!.query('DELETE FROM "seed_operations"');
  await dataSource!.query('DELETE FROM "user_sessions"');
  await dataSource!.query('DELETE FROM "user_identities"');
  await dataSource!.query('DELETE FROM "user_credentials"');
  await dataSource!.query('DELETE FROM "users"');
};

if (runDatabaseTests) {
  beforeAll(async () => {
    await dataSource!.initialize();
    await dataSource!.runMigrations();
    await clearDatabase();
    userService = new UserService(
      userRepositoryForTest(),
      dataSource!,
      userIdentityRepositoryForTest(),
      userCredentialRepositoryForTest(),
    );
    identitiesService = new IdentitiesService(userService);
    seedService = new SeedService(
      dataSource!.getRepository(SeedOperation),
      dataSource!,
    );
  });

  afterEach(async () => {
    await clearDatabase();
  });

  afterAll(async () => {
    if (dataSource?.isInitialized) {
      await dataSource.destroy();
    }
  });
}
