import { getMetadataArgsStorage } from 'typeorm';
import { describe, expect, it } from 'vitest';

import {
  User,
  UserCredential,
  UserIdentity,
  UserSession,
} from '../../../../../src/modules/user/entities/index.js';

const columnsFor = (target: Function) =>
  getMetadataArgsStorage().columns.filter((column) => column.target === target);

const columnFor = (target: Function, propertyName: string) =>
  columnsFor(target).find((column) => column.propertyName === propertyName);

describe('TypeORM persistence metadata', () => {
  it('maps all identity entities to their expected tables', () => {
    const entities = [User, UserCredential, UserIdentity, UserSession];
    const tables = getMetadataArgsStorage()
      .tables.filter((table) => entities.includes(table.target as typeof User))
      .map((table) => table.name);

    expect(tables).toEqual(
      expect.arrayContaining([
        'users',
        'user_credentials',
        'user_identities',
        'user_sessions',
      ]),
    );
  });

  it('keeps normalized email and credential ownership unique', () => {
    expect(columnFor(User, 'normalizedEmail')?.options.unique).toBe(true);
    expect(columnFor(UserCredential, 'userId')?.options.unique).not.toBe(true);

    const credentialRelation = getMetadataArgsStorage().relations.find(
      (relation) =>
        relation.target === UserCredential &&
        relation.propertyName === 'user',
    );

    expect(credentialRelation?.relationType).toBe('one-to-one');
  });

  it('defines the external identity uniqueness rules', () => {
    const indices = getMetadataArgsStorage().indices.filter(
      (index) => index.target === UserIdentity,
    );

    expect(indices).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'uq_user_identity_provider_subject',
          columns: ['provider', 'providerSubject'],
          unique: true,
        }),
        expect.objectContaining({
          name: 'uq_user_identity_user_provider',
          columns: ['userId', 'provider'],
          unique: true,
        }),
      ]),
    );
  });

  it('defines searchable session columns without making user ownership unique', () => {
    const indices = getMetadataArgsStorage().indices.filter(
      (index) => index.target === UserSession,
    );

    expect(indices).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'idx_user_session_user_id',
          columns: ['userId'],
        }),
        expect.objectContaining({
          name: 'idx_user_session_expires_at',
          columns: ['expiresAt'],
        }),
      ]),
    );
    expect(columnFor(UserSession, 'userId')?.options.unique).not.toBe(true);
    expect(columnFor(UserSession, 'tokenHash')?.options.unique).toBe(true);
  });
});
