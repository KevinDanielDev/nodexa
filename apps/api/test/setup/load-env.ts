import { fileURLToPath } from 'node:url';

import { config } from 'dotenv';

config({
  path: fileURLToPath(new URL('../../.env', import.meta.url)),
});

if (process.env.RUN_DATABASE_TESTS === 'true' && process.env.TEST_DATABASE_URL) {
  const testDatabaseUrl = new URL(process.env.TEST_DATABASE_URL);
  const testDatabaseName = decodeURIComponent(
    testDatabaseUrl.pathname.replace(/^\//, ''),
  );

  if (testDatabaseName !== 'nodexa_test')
    throw new Error(
      'Database tests must use the nodexa_test database configured in TEST_DATABASE_URL.',
    );

  process.env.DB_HOST = testDatabaseUrl.hostname;
  process.env.POSTGRES_PORT = testDatabaseUrl.port || '5432';
  process.env.POSTGRES_USER = decodeURIComponent(testDatabaseUrl.username);
  process.env.POSTGRES_PASSWORD = decodeURIComponent(testDatabaseUrl.password);
  process.env.POSTGRES_DB = testDatabaseName;
}
