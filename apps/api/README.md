# Nodexa API

NestJS API workspace for the Nodexa monorepo.

## Commands

Run these commands from the repository root:

```bash
bun run --filter api dev
bun run --filter api build
bun run --filter api lint
bun run --filter api check-types
bun run --filter api test
bun run --filter api test:e2e
```

The API exposes `GET /health` as its initial health check.

## Structure

```text
src/
├── main.ts
├── app.module.ts
└── modules/
    └── health/
        ├── health.controller.ts
        ├── health.module.ts
        └── health.service.ts
```

## Tooling

- NestJS for the API runtime.
- Oxlint for linting.
- TypeScript configuration inherited from `packages/typescript-config`.
- Vitest for unit and end-to-end tests.
- Turborepo runs the workspace scripts from the repository root.
