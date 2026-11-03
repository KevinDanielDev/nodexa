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

1. [Data model](docs/architecture/data-model/README.md) — DBML reference and
   modeled areas.
2. [Identity contract](docs/architecture/identity/README.md) — identity and
   authentication boundaries.

## Development setup

Prepare the local environment in the following order:

1. [PostgreSQL with Podman](infra/local/podman/postgres/README.md) — create
   the local database environment before starting the application.

Additional setup steps will be added here as more project infrastructure is
introduced.
