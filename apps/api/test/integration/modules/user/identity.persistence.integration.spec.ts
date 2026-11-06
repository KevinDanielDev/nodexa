import { randomUUID } from 'node:crypto';

import { DataSource } from 'typeorm';
import { describe, expect, it } from 'vitest';

import { InitialIdentity1793989414762 } from '../../../../src/modules/database/migrations/1793989414762-InitialIdentity.js';
import {
  User,
  UserCredential,
  UserIdentity,
  UserSession,
} from '../../../../src/modules/user/entities/index.js';
import { EIdentityProvider, EUserStatus } from '../../../../src/modules/user/enums/index.js';

const databaseUrl = process.env.TEST_DATABASE_URL;
const runDatabaseTests = process.env.RUN_DATABASE_TESTS === 'true' && databaseUrl;

const dataSource = runDatabaseTests
  ? new DataSource({
      type: 'postgres',
      url: databaseUrl,
      entities: [User, UserCredential, UserIdentity, UserSession],
      migrations: [InitialIdentity1793989414762],
      synchronize: false,
    })
  : undefined;

const createUser = (email = `${randomUUID()}@gmail.com`): User => {
  const user = new User();
  user.email = email;
  user.firstName = 'Test';
  user.lastName = 'User';
  user.status = EUserStatus.ACTIVE;
  return user;
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
});

if (runDatabaseTests) {
  beforeAll(async () => {
    await dataSource!.initialize();
    await dataSource!.runMigrations();
  });

  afterEach(async () => {
    await dataSource!.query('DELETE FROM "user_sessions"');
    await dataSource!.query('DELETE FROM "user_identities"');
    await dataSource!.query('DELETE FROM "user_credentials"');
    await dataSource!.query('DELETE FROM "users"');
  });

  afterAll(async () => {
    await dataSource!.destroy();
  });
}
