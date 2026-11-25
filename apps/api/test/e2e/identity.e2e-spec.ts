import { ValidationPipe, type INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { DataSource } from 'typeorm';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import request from 'supertest';

import { AppModule } from '../../src/app.module.js';

import { normalizedEmail } from '../../src/modules/common/utils/normalized-email.js';
import { EIdentityProvider } from '../../src/modules/user/enums/identity-provider.enum.js';
import { UserCredential } from '../../src/modules/user/entities/user-credential.entity.js';
import { UserIdentity } from '../../src/modules/user/entities/user-identity.entity.js';
import { User } from '../../src/modules/user/entities/user.entity.js';

const configuredTestDatabase = process.env.TEST_DATABASE_URL
  ? new URL(process.env.TEST_DATABASE_URL).pathname.slice(1)
  : null;
const runE2eTests =
  process.env.RUN_DATABASE_TESTS === 'true' && Boolean(configuredTestDatabase);

describe('Identity HTTP API', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  beforeAll(async () => {
    if (!runE2eTests)
      throw new Error(
        'E2E tests require RUN_DATABASE_TESTS=true and a valid TEST_DATABASE_URL.',
      );

    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    const nestApp = module.createNestApplication();
    nestApp.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await nestApp.init();
    app = nestApp;
    dataSource = app.get(DataSource);
  });

  afterEach(async () => {
    if (!dataSource?.isInitialized) return;
    await dataSource.query('DELETE FROM "seed_operations"');
    await dataSource.query('DELETE FROM "user_sessions"');
    await dataSource.query('DELETE FROM "user_identities"');
    await dataSource.query('DELETE FROM "user_credentials"');
    await dataSource.query('DELETE FROM "users"');
  });

  afterAll(async () => {
    if (app) await app.close();
  });

  it('rejects creating an account without authentication data', async () => {
    await request(app.getHttpServer())
      .post('/user/create')
      .send({
        user: {
          email: 'person@gmail.com',
          firstName: 'Ada',
          lastName: 'Lovelace',
          displayName: '',
          avatarUrl: '',
        },
        identities: [],
      })
      .expect(400);
  });

  it('creates a local account and stores a credential hash', async () => {
    const email = `local-${Date.now()}@gmail.com`;
    const response = await request(app.getHttpServer())
      .post('/user/create')
      .send({
        user: {
          email,
          firstName: 'Ada',
          lastName: 'Lovelace',
          displayName: '',
          avatarUrl: '',
        },
        credential: { password: 'password123' },
        identities: [],
      })
      .expect(201);

    expect(response.body.message).toBe('User created successfully');
    const user = await dataSource.getRepository(User).findOneBy({
      normalizedEmail: email,
    });
    const credential = await dataSource
      .getRepository(UserCredential)
      .findOneBy({ userId: user!.id });

    expect(credential?.passwordHash).toBeTruthy();
    expect(credential?.passwordHash).not.toBe('password123');
  });

  it('links and unlinks an identity while preserving the credential', async () => {
    const email = `link-${Date.now()}@gmail.com`;
    await request(app.getHttpServer())
      .post('/user/create')
      .send({
        user: {
          email,
          firstName: 'Ada',
          lastName: 'Lovelace',
          displayName: '',
          avatarUrl: '',
        },
        credential: { password: 'password123' },
        identities: [],
      })
      .expect(201);

    const user = await dataSource.getRepository(User).findOneBy({
      normalizedEmail: email,
    });
    const providerSubject = `subject-${Date.now()}`;

    await request(app.getHttpServer())
      .post('/identities/link')
      .send({
        userId: user!.id,
        provider: EIdentityProvider.GOOGLE,
        providerSubject,
      })
      .expect(201);

    await request(app.getHttpServer())
      .delete('/identities/unlink')
      .send({ userId: user!.id, provider: EIdentityProvider.GOOGLE })
      .expect(200);

    expect(await dataSource.getRepository(UserIdentity).count()).toBe(0);
    expect(await dataSource.getRepository(UserCredential).count()).toBe(1);
  });

  it('returns a conflict when an external identity is already linked elsewhere', async () => {
    const firstEmail = `first-${Date.now()}@gmail.com`;
    const secondEmail = `second-${Date.now()}@gmail.com`;
    const first = await dataSource.getRepository(User).save({
      email: firstEmail,
      normalizedEmail: normalizedEmail(firstEmail),
      firstName: 'First',
      lastName: 'User',
    });
    const second = await dataSource.getRepository(User).save({
      email: secondEmail,
      normalizedEmail: normalizedEmail(secondEmail),
      firstName: 'Second',
      lastName: 'User',
    });
    const providerSubject = `shared-${Date.now()}`;

    await request(app.getHttpServer())
      .post('/identities/link')
      .send({
        userId: first.id,
        provider: EIdentityProvider.GOOGLE,
        providerSubject,
      })
      .expect(201);

    const response = await request(app.getHttpServer())
      .post('/identities/link')
      .send({
        userId: second.id,
        provider: EIdentityProvider.GOOGLE,
        providerSubject,
      })
      .expect(409);

    expect(response.body.message).toBe(
      'External identity is already linked to another user',
    );
  });
});
