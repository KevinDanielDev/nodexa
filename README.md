# Nodexa

Base monorepo for Nodexa.

## Tooling

- Bun workspaces
- Turborepo
- Shared TypeScript configuration in `packages/typescript-config`
- Oxlint for the NestJS API
- Vitest for API tests

The application workspaces and shared domain packages will be added as the
NestJS, Vue, and Quasar structure is defined.

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

## Development setup

Use the following guides in order:

1. [PostgreSQL with Podman](infra/local/podman/postgres/README.md) — local
   database infrastructure.
2. [API workspace](apps/api/README.md) — API configuration, migrations, and
   runtime commands.

Workspace-specific READMEs contain the operational instructions for each
component.
