# Nodexa

Base monorepo for Nodexa.

## Tooling

- Bun workspaces
- Turborepo
- Shared TypeScript configuration in `packages/typescript-config`
- Oxlint for the NestJS API
- Vitest for API tests

The current application workspace is a NestJS API in `apps/api`. It provides
the initial account and identity core, local credential verification through an
internal `AuthService`, PostgreSQL persistence, idempotent seeds, and the
corresponding unit, integration, and end-to-end test structure. Vue, Quasar,
HTTP authentication exposure, JWTs, cookies, and server-managed session flows
remain future work.

## Commands

```bash
bun install
bun run dev
bun run build
bun run lint
bun run check-types
bun run test
```

## Documentation

Follow the documentation in this order:

1. [PostgreSQL with Podman](infra/local/podman/postgres/README.md) — start the
   local database environment.
2. [API workspace](apps/api/README.md) — configure the API and run migrations.
3. [Data model](docs/architecture/data-model/README.md) — DBML reference,
   implemented identity schema, and modeled areas.
4. [Identity contract](docs/architecture/identity/README.md) — identity and
   authentication boundaries.
5. [CI workflows](.github/workflows/) — quality gates, PostgreSQL
   infrastructure checks, and PostgreSQL integration tests.

## Development setup

Use the following guides in order:

1. [PostgreSQL with Podman](infra/local/podman/postgres/README.md) — local
   database infrastructure.
2. [API workspace](apps/api/README.md) — API configuration, migrations, and
   runtime commands.

Workspace-specific READMEs contain the operational instructions for each
component.
