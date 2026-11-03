# Nodexa

Monorepo base de Nodexa.

## Herramientas

- Workspaces de Bun
- Turborepo
- Configuración compartida de TypeScript en `packages/typescript-config`
- Oxlint para la API de NestJS
- Vitest para las pruebas de la API

Los workspaces de aplicación y los paquetes compartidos del dominio se
incorporarán a medida que se defina la estructura con NestJS, Vue y Quasar.

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

1. [Modelo de datos](docs/architecture/data-model/README.es.md) — referencia
   del DBML y áreas modeladas.
2. [Contrato de identidad](docs/architecture/identity/README.es.md) —
   límites de identidad y autenticación.

## Configuración de desarrollo

Prepara el entorno local en el siguiente orden:

1. [PostgreSQL con Podman](infra/local/podman/postgres/README.es.md) — crea el
   entorno local de base de datos antes de iniciar la aplicación.

Los pasos adicionales de configuración se añadirán aquí a medida que se
incorpore nueva infraestructura al proyecto.
