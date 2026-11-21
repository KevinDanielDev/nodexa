import { readFile } from 'node:fs/promises';

import { describe, expect, it } from 'vitest';

const migrationPath = new URL(
  '../../../../../src/modules/database/migrations/1794415254760-SeedOperations.ts',
  import.meta.url,
);

describe('Seed operations migration', () => {
  it('creates the idempotency table with the required columns and constraints', async () => {
    const migration = await readFile(migrationPath, 'utf8');

    expect(migration).toContain('CREATE TABLE "seed_operations"');
    expect(migration).toContain('"key" text NOT NULL');
    expect(migration).toContain('"status"');
    expect(migration).toContain('"metadata" jsonb');
    expect(migration).toContain('UNIQUE ("key")');
    expect(migration).toContain('uuid_generate_v4()');
  });

  it('has a reversible down migration', async () => {
    const migration = await readFile(migrationPath, 'utf8');

    expect(migration).toContain('DROP TABLE "seed_operations"');
    expect(migration).toContain(
      'DROP TYPE "public"."seed_operations_status_enum"',
    );
  });
});
