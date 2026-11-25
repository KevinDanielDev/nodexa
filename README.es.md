# Nodexa

Monorepo base de Nodexa.

## Herramientas

- Workspaces de Bun
- Turborepo
- Configuración compartida de TypeScript en `packages/typescript-config`
- Oxlint para la API de NestJS
- Vitest para las pruebas de la API

El workspace de aplicación actual es una API NestJS en `apps/api`. Proporciona
el núcleo inicial de cuentas e identidades, verificación de credenciales
locales mediante un `AuthService` interno, persistencia PostgreSQL, seeds
idempotentes y la estructura correspondiente de pruebas unitarias, de
integración y end-to-end. La interfaz Vue, Quasar, la exposición HTTP de
autenticación, los JWT, las cookies y los flujos de sesiones administradas por
el servidor quedan para trabajo futuro.

## Comandos

```bash
bun install
bun run dev
bun run build
bun run lint
bun run check-types
bun run test
```

## Documentación

Sigue la documentación en este orden:

1. [PostgreSQL con Podman](infra/local/podman/postgres/README.es.md) — inicia
   el entorno local de base de datos.
2. [Workspace de la API](apps/api/README.es.md) — configura la API y ejecuta
   las migraciones.
3. [Modelo de datos](docs/architecture/data-model/README.es.md) — referencia
   del DBML, esquema de identidad implementado y áreas modeladas.
4. [Contrato de identidad](docs/architecture/identity/README.es.md) —
   límites de identidad y autenticación.
5. [Workflows de CI](.github/workflows/) — quality gates, validación de
   infraestructura PostgreSQL y pruebas de integración PostgreSQL.

## Configuración de desarrollo

Consulta las siguientes guías en orden:

1. [PostgreSQL con Podman](infra/local/podman/postgres/README.es.md) —
   infraestructura local de base de datos.
2. [Workspace de la API](apps/api/README.es.md) — configuración de la API,
   migraciones y comandos de ejecución.

Los README específicos de cada workspace contienen las instrucciones
operativas de cada componente.
