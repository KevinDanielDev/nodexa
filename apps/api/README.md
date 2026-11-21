<p align="center">
  <a href="http://nestjs.com/" target="_blank">
    <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="NestJS Logo" />
  </a>
</p>

# Nodexa API

NestJS API workspace for the Nodexa monorepo.

## Commands

Run these commands from the repository root:

```bash
bun run --cwd apps/api dev
bun run --cwd apps/api build
bun run --cwd apps/api lint
bun run --cwd apps/api check-types
bun run --cwd apps/api test
bun run --cwd apps/api test:e2e
```

The API exposes `GET /health` as a health check and currently includes internal
account, identity-linking, and user-seeding endpoints. Authentication flows and
JWT issuance are outside this milestone.

## Tests

The API uses Vitest and keeps tests organized according to the `src` module
structure:

```text
test/
├── unit/
│   └── modules/
│       ├── database/migrations/
│       ├── identities/
│       ├── seed/
│       └── user/
├── integration/
    └── modules/user/
└── e2e/
    └── identity.e2e-spec.ts
```

The unit tests verify entity behavior, service rules, seed idempotency, TypeORM
metadata, migration structure, constraints, indexes, and reversible migration
definitions. They do not require PostgreSQL:

```bash
bun run --cwd apps/api test
```

The persistence integration tests verify PostgreSQL-specific constraints for
normalized emails, credentials, external identities, and sessions. They are
controlled by the local API environment:

Vitest loads `apps/api/.env` before the test suite through
`test/setup/load-env.ts`. Set `RUN_DATABASE_TESTS=true` and provide a valid
`TEST_DATABASE_URL` in that file to run the PostgreSQL integration tests. If
the flag is not enabled, only the unit tests run and the integration tests are
skipped:

```env
RUN_DATABASE_TESTS=true
TEST_DATABASE_URL=postgresql://svc_nodexa:your_password@localhost:5432/nodexa_test
```

The integration suite runs all committed migrations, including
`SeedOperations1794415254760`, clears its test records between cases, and must
point to `nodexa_test`, never the development database. It verifies account
creation, authentication-method invariants, identity uniqueness, unlinking,
seed idempotency, and PostgreSQL cascades.
The PostgreSQL integration workflow creates an ephemeral database configuration,
runs the migrations and tests, and removes all resources even when a step fails.
CI generates a temporary password on the GitHub runner, creates a temporary
`apps/api/.env`, and discards both with the PostgreSQL resources after the job.

The repository has separate CI responsibilities:

- `Quality Gates` runs build, lint, type-check, and the regular test command.
- `PostgreSQL Infrastructure` verifies the local Podman PostgreSQL environment.
- `PostgreSQL Integration` creates an ephemeral `nodexa_test`, applies the
  committed migrations, runs unit and PostgreSQL integration tests with
  integration enabled, runs the HTTP end-to-end suite, and tears down the
  resources. The integration workflow must fail if the test database cannot be
  reached; skipped database tests are not considered coverage.

## HTTP endpoints

The current internal endpoints are:

- `GET /health` — health check.
- `POST /user/create` — creates an internal account with a credential, an
  external identity, or both. At least one authentication method is required.
- `POST /identities/link` — links one provider identity to an existing account.
- `DELETE /identities/unlink` — removes an identity only when another
  authentication method remains.
- `POST /seed/users` — loads the deterministic user seed and is idempotent by
  content hash.

Validation is applied globally with `ValidationPipe`, and database conflicts
are translated by the global exception filter.

## Local configuration

Copy the environment template before starting the API:

```bash
cp apps/api/.env.example apps/api/.env
```

Set `POSTGRES_PORT`, `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, and
`DB_HOST` to match the local PostgreSQL environment. The `.env` file is local
and must not be committed.

For local integration and end-to-end tests, also set `TEST_DATABASE_URL` and
`RUN_DATABASE_TESTS` in the same `.env` file. The development and test
databases may use the same PostgreSQL credentials, but `TEST_DATABASE_URL`
must always select `nodexa_test`.

## Database migrations

The API uses TypeORM with explicit versioned migrations. `synchronize` is
disabled. The local startup order is:

1. Start PostgreSQL with the [Podman setup](../../infra/local/podman/postgres/README.md).
2. Apply pending migrations:

   ```bash
   bun run --cwd apps/api migration:run
   ```

3. Start the API:

   ```bash
   bun run --cwd apps/api dev
   ```

Available migration commands:

```bash
bun run --cwd apps/api migration:generate
bun run --cwd apps/api migration:run
bun run --cwd apps/api migration:show
bun run --cwd apps/api migration:revert
```

When entities change, generate a migration, review the generated SQL, run it
against a disposable development database, and commit the migration file.
Never replace a committed migration or enable `synchronize` to bypass the
migration history. `migration:revert` is intended for local validation and
rollback testing.

The CLI uses `src/modules/database/data-source.ts` after the API build. The
DataSource explicitly registers the entities and migration files and loads
environment variables independently from the Nest application.

The `seed_operations` table stores the content-hash key, resource, status,
metadata, and completion timestamp for idempotent seed executions. A repeated
seed with the same completed content returns without inserting duplicate users;
failed operations can be retried.

## Structure

```text
src/
├── main.ts
├── app.module.ts
└── modules/
    ├── database/
    │   ├── data-source.ts
    │   ├── database.module.ts
    │   └── migrations/
    ├── health/
    ├── common/
    ├── identities/
    ├── seed/
    └── user/
        ├── entities/
        ├── enums/
        ├── user.controller.ts
        ├── user.module.ts
        └── user.service.ts
```

## Tooling

- NestJS for the API runtime.
- Oxlint for linting.
- TypeScript configuration inherited from `packages/typescript-config`.
- Vitest for unit and end-to-end tests.
- Turborepo runs the workspace scripts from the repository root.
