<p align="center">
  <a href="http://nestjs.com/" target="_blank">
    <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Logo de NestJS" />
  </a>
</p>

# API de Nodexa

Workspace de la API NestJS del monorepo de Nodexa.

## Comandos

Ejecuta estos comandos desde la raíz del repositorio:

```bash
bun run --cwd apps/api dev
bun run --cwd apps/api build
bun run --cwd apps/api lint
bun run --cwd apps/api check-types
bun run --cwd apps/api test
bun run --cwd apps/api test:e2e
```

La API expone inicialmente `GET /health` como endpoint de verificación.

## Pruebas

La API utiliza Vitest y mantiene las pruebas organizadas de acuerdo con la
estructura de módulos de `src`:

```text
test/
├── unit/
│   └── modules/
│       ├── database/migrations/
│       └── user/entities/
└── integration/
    └── modules/user/
```

Las pruebas unitarias verifican el comportamiento de las entidades, los
metadatos de TypeORM, la estructura de la migración, sus restricciones,
índices y reversibilidad. No requieren PostgreSQL:

```bash
bun run --cwd apps/api test
```

Las pruebas de integración de persistencia verifican restricciones específicas
de PostgreSQL para correos normalizados, credenciales, identidades externas y
sesiones. Se controlan mediante el entorno local de la API:

Vitest carga `apps/api/.env` antes de la suite mediante
`test/setup/load-env.ts`. Define `RUN_DATABASE_TESTS=true` y proporciona un
`TEST_DATABASE_URL` válido en ese archivo para ejecutar las pruebas de
integración PostgreSQL. Si la bandera no está habilitada, solo se ejecutan las
pruebas unitarias y las de integración se omiten:

```env
RUN_DATABASE_TESTS=true
TEST_DATABASE_URL=postgresql://svc_nodexa:tu_password@localhost:5432/nodexa_test
```

La suite de integración ejecuta las migraciones commiteadas, limpia sus
registros entre casos y debe apuntar a `nodexa_test`, nunca a la base de
desarrollo. El workflow de integración PostgreSQL crea una configuración
efímera, ejecuta las migraciones y las pruebas, y elimina todos los recursos
incluso cuando falla un paso. CI genera una contraseña temporal en el runner de
GitHub, crea un `apps/api/.env` temporal y descarta ambos junto con los
recursos de PostgreSQL al finalizar el job.

El repositorio separa las responsabilidades de CI:

- `Quality Gates` ejecuta build, lint, type-check y el comando normal de tests.
- `PostgreSQL Infrastructure` verifica el entorno local de PostgreSQL con
  Podman.
- `PostgreSQL Integration` crea una `nodexa_test` efímera, aplica las
  migraciones commiteadas, ejecuta todos los tests con integración habilitada y
  elimina los recursos.

## Configuración local

Copia la plantilla de variables antes de iniciar la API:

```bash
cp apps/api/.env.example apps/api/.env
```

Configura `POSTGRES_PORT`, `POSTGRES_DB`, `POSTGRES_USER`,
`POSTGRES_PASSWORD` y `DB_HOST` de acuerdo con el PostgreSQL local. El archivo
`.env` es local y no debe committearse.

Para las pruebas locales de integración, configura también
`TEST_DATABASE_URL` y `RUN_DATABASE_TESTS` en el mismo archivo `.env`. Las
bases de desarrollo y pruebas pueden utilizar las mismas credenciales de
PostgreSQL, pero `TEST_DATABASE_URL` siempre debe seleccionar `nodexa_test`.

La aplicación valida únicamente los dominios de correo definidos por la
política actual de identidad. Esa lista se mantiene en
`src/modules/user/constants/email-domains.constants.ts`.

## Migraciones de base de datos

La API utiliza TypeORM con migraciones explícitas versionadas. `synchronize`
está deshabilitado. El orden de inicio local es:

1. Inicia PostgreSQL con la [configuración de Podman](../../infra/local/podman/postgres/README.es.md).
2. Ejecuta las migraciones pendientes:

   ```bash
   bun run --cwd apps/api migration:run
   ```

3. Inicia la API:

   ```bash
   bun run --cwd apps/api dev
   ```

Comandos disponibles:

```bash
bun run --cwd apps/api migration:generate
bun run --cwd apps/api migration:run
bun run --cwd apps/api migration:show
bun run --cwd apps/api migration:revert
```

Cuando cambien las entidades, genera una migración, revisa el SQL generado,
ejecútalo contra una base de datos de desarrollo desechable y commitea el
archivo de migración. Nunca reemplaces una migración ya commiteada ni actives
`synchronize` para evitar el historial. `migration:revert` está pensado para
validación local y pruebas de rollback.

El CLI utiliza `src/modules/database/data-source.ts` después de compilar la
API. El `DataSource` registra explícitamente las entidades y migraciones, y
carga las variables de entorno de forma independiente al contenedor de Nest.

## Estructura

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

## Herramientas

- NestJS para el runtime de la API.
- TypeORM y PostgreSQL para persistencia.
- Oxlint para linting.
- TypeScript mediante `packages/typescript-config`.
- Vitest para pruebas unitarias y end-to-end.
- Turborepo ejecuta los scripts del workspace desde la raíz.
