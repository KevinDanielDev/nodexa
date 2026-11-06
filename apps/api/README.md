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

The API exposes `GET /health` as its initial health check.

## Tests

The API uses Vitest and keeps tests organized according to the `src` module
structure:

```text
test/
├── unit/
│   └── modules/
│       ├── database/migrations/
│       └── user/entities/
└── integration/
    └── modules/user/
```

The unit tests verify entity behavior, TypeORM metadata, migration structure,
constraints, indexes, and reversible migration definitions. They do not
require PostgreSQL:

```bash
bun run --cwd apps/api test
```

The persistence integration tests verify PostgreSQL-specific constraints for
normalized emails, credentials, external identities, and sessions. They are
opt-in until the dedicated test database environment is introduced:

```bash
RUN_DATABASE_TESTS=true \
TEST_DATABASE_URL=postgresql://user:password@localhost:5432/nodexa_test \
bun run --cwd apps/api test
```

The integration suite runs the committed migrations, clears its test records
between cases, and never uses the development database unless
`TEST_DATABASE_URL` is configured incorrectly. The dedicated PostgreSQL test
database and its CI workflow are tracked separately from this initial database
integration issue.

## Local configuration

Copy the environment template before starting the API:

```bash
cp apps/api/.env.example apps/api/.env
```

Set `POSTGRES_PORT`, `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, and
`DB_HOST` to match the local PostgreSQL environment. The `.env` file is local
and must not be committed.

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
