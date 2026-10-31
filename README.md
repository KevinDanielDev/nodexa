# Nodexa

Monorepo base for Nodexa.

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
```
