import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';

const migrationPath = new URL(
  '../../../../../src/modules/database/migrations/1793989414762-InitialIdentity.ts',
  import.meta.url,
);

describe('Initial identity migration', () => {
  it('creates the UUID extension before UUID-backed tables', async () => {
    const migration = await readFile(migrationPath, 'utf8');
    const extensionPosition = migration.indexOf(
      'CREATE EXTENSION IF NOT EXISTS "uuid-ossp"',
    );
    const firstTablePosition = migration.indexOf(
      'CREATE TABLE "user_credentials"',
    );

    expect(extensionPosition).toBeGreaterThan(-1);
    expect(extensionPosition).toBeLessThan(firstTablePosition);
    expect(migration).toContain('DEFAULT uuid_generate_v4()');
  });

  it('contains the identity constraints and indexes', async () => {
    const migration = await readFile(migrationPath, 'utf8');

    expect(migration).toContain('UNIQUE ("user_id")');
    expect(migration).toContain(
      'uq_user_identity_user_provider" ON "user_identities"',
    );
    expect(migration).toContain(
      'uq_user_identity_provider_subject" ON "user_identities"',
    );
    expect(migration).toContain(
      'idx_user_session_user_id" ON "user_sessions"',
    );
    expect(migration).toContain(
      'idx_user_session_expires_at" ON "user_sessions"',
    );
    expect(migration).toContain('UNIQUE ("token_hash")');
  });

  it('defines cascading foreign keys and a reversible down migration', async () => {
    const migration = await readFile(migrationPath, 'utf8');

    expect(migration.match(/ON DELETE CASCADE/g)).toHaveLength(3);
    expect(migration).toContain('public async down(queryRunner: QueryRunner)');
    expect(migration).toContain('DROP TABLE "users"');
    expect(migration).toContain('DROP TYPE "public"."users_status_enum"');
    expect(migration).toContain(
      'DROP TYPE "public"."user_identities_provider_enum"',
    );
  });
});
